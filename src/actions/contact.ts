'use server';

import nodemailer from 'nodemailer';

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name || !email || !message) {
    return { success: false, error: 'missing_fields' };
  }

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
