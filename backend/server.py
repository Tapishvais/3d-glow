import logging
import os
import re
import ipaddress
from collections import defaultdict
from html import escape
from html.parser import HTMLParser
from time import time
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

load_dotenv()
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Emergent managed email proxy — constant, never from env (survives deployment).
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")
CONTACT_EMAIL = os.environ["CONTACT_EMAIL"]

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


class ContactPayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)


_hits: dict[str, list[float]] = defaultdict(list)


@api_router.get("/")
async def root():
    return {"message": "Kurieta API"}


@api_router.post("/contact")
async def contact(payload: ContactPayload, request: Request):
    ip = request.client.host if request.client else "unknown"
    now = time()
    hits = [t for t in _hits[ip] if now - t < 600]
    if len(hits) >= 6:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    hits.append(now)
    _hits[ip] = hits

    name = escape(payload.name.strip())
    email = escape(payload.email.strip())
    message = escape(payload.message.strip())
    subject = "New enquiry — " + re.sub(r"[\r\n]+", " ", payload.name.strip())[:80]
    html = (
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
        '<td style="padding:32px;font-family:Arial,sans-serif;background:#0A0E1F;color:#F6F7FC">'
        '<p style="font-size:11px;letter-spacing:3px;color:#3D5CFF;text-transform:uppercase;margin:0 0 16px">'
        'Kurieta — New enquiry</p>'
        f'<p style="font-size:20px;font-weight:600;margin:0 0 4px">{name}</p>'
        f'<p style="margin:0 0 20px"><a href="mailto:{email}" style="color:#3D5CFF">{email}</a></p>'
        f'<p style="line-height:1.7;white-space:pre-wrap;margin:0">{message}</p>'
        '<hr style="border:none;border-top:1px solid #1A2247;margin:28px 0">'
        '<p style="font-size:11px;color:#8a8fa8;margin:0">Sent by the Kurieta website contact form · '
        '<a href="https://kurieta.com" style="color:#8a8fa8">kurieta.com</a></p>'
        '</td></tr></table>'
    )
    email_id = await send_email(to=CONTACT_EMAIL, subject=subject, html=html)
    return {"status": "ok", "id": email_id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
