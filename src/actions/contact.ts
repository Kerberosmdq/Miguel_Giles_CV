'use server';

import nodemailer from 'nodemailer';

export async function sendContactEmail(formData: FormData) {
  const raw = {
    name: formData.get('name')?.toString().trim() ?? '',
    email: formData.get('email')?.toString().trim() ?? '',
    message: formData.get('message')?.toString().trim() ?? '',
  };

  if (!raw.name || !raw.email || !raw.message) {
    return { success: false, error: 'missing_fields' };
  }

  if (raw.name.length > 100 || raw.email.length > 254 || raw.message.length > 2000) {
    return { success: false, error: 'missing_fields' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(raw.email)) {
    return { success: false, error: 'missing_fields' };
  }

  // Strip newlines to prevent email header injection
  const name = raw.name.replace(/[\r\n]/g, ' ');
  const email = raw.email.replace(/[\r\n]/g, '');
  const message = raw.message.replace(/[\r\n]/g, (c) => c === '\n' ? '<br>' : '');

  const appPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!appPassword) {
    console.error('[contact] GMAIL_APP_PASSWORD not set');
    return { success: false, error: 'not_configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'miga.gls246@gmail.com',
        pass: appPassword,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio NexCV" <miga.gls246@gmail.com>`,
      to: 'miga.gls246@gmail.com',
      replyTo: email,
      subject: `[Portfolio] Mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #0A0A0A;">Nuevo mensaje desde tu portfolio</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border-color: #eee;" />
          <p style="white-space: pre-line;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error('[contact] nodemailer error:', err);
    return { success: false, error: 'send_failed' };
  }
}
