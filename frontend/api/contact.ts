// Vercel Edge Function — contact form → Resend
// Required env vars in Vercel project settings:
//   RESEND_API_KEY  — from resend.com
//   CONTACT_EMAIL   — inbox that receives enquiries (e.g. hello@kurieta.com)
//   EMAIL_FROM      — verified sender, e.g. "Kurieta <hello@yourdomain.com>"

export const config = { runtime: 'edge' }

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message || String(message).length > 5000) {
      return Response.json({ error: 'Invalid fields' }, { status: 400 })
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Kurieta <hello@kurieta.com>',
        to: [process.env.CONTACT_EMAIL || 'hello@kurieta.com'],
        reply_to: email,
        subject: `New enquiry — ${String(name).replace(/[\r\n]+/g, ' ').slice(0, 80)}`,
        html: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px;font-family:Arial,sans-serif;background:#0A0E1F;color:#F6F7FC"><p style="font-size:11px;letter-spacing:3px;color:#3D5CFF;text-transform:uppercase">Kurieta — New enquiry</p><p style="font-size:20px;font-weight:600">${esc(String(name))}</p><p><a href="mailto:${esc(String(email))}" style="color:#3D5CFF">${esc(String(email))}</a></p><p style="line-height:1.7;white-space:pre-wrap">${esc(String(message))}</p><hr style="border:none;border-top:1px solid #1A2247;margin:28px 0"><p style="font-size:11px;color:#8a8fa8">Sent by the Kurieta website contact form · <a href="https://kurieta.com" style="color:#8a8fa8">kurieta.com</a></p></td></tr></table>`,
      }),
    })
    if (!res.ok) return Response.json({ error: 'Send failed' }, { status: 502 })
    return Response.json({ status: 'ok' })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
