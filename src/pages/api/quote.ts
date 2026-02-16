import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  description: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = locals.runtime;

  try {
    const {
      name, email, phone, company, service, description,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    } = (await request.json()) as QuoteRequest;

    // Validate required fields
    if (!name || !email || !phone || !service || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Store in D1
    await runtime.env.DB.prepare(
      `INSERT INTO quotes (name, email, phone, company, service, description, utm_source, utm_medium, utm_campaign, utm_term, utm_content, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      name, email, phone, company || null, service, description,
      utm_source || null, utm_medium || null, utm_campaign || null, utm_term || null, utm_content || null,
      Date.now()
    ).run();

    // Send notification email (non-blocking)
    try {
      if (runtime.env.RESEND_API_KEY) {
        const resend = new Resend(runtime.env.RESEND_API_KEY as string);
        const utmInfo = [utm_source, utm_medium, utm_campaign].filter(Boolean).join(' / ');

        await resend.emails.send({
          from: runtime.env.RESEND_FROM_EMAIL || 'hello@pmplastics.com.au',
          to: runtime.env.NOTIFICATION_EMAIL || 'team@pmplastics.com.au',
          subject: `New Quote Request — ${service}`,
          html: `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Details:</strong></p>
            <p>${description}</p>
            <hr />
            <p><strong>Source:</strong> ${utmInfo || 'Direct'}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Quote submission failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to submit quote' }), { status: 500 });
  }
};
