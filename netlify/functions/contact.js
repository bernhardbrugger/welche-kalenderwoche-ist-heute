// netlify/functions/contact.js

const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.error('WARNUNG: SENDGRID_API_KEY nicht gesetzt.');
}

exports.handler = async function(event, context) {
  console.log('DEBUG: contact Function aufgerufen, HTTP-Method:', event.httpMethod);
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Ungültiges JSON im Request-Body' }),
    };
  }

  const { name, email, subject, message, recaptchaToken, action } = body;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Fehlende Pflichtfelder' }),
    };
  }
  if (!recaptchaToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Kein reCAPTCHA-Token übermittelt.' }),
    };
  }
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.error('RECAPTCHA_SECRET_KEY nicht gesetzt.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Serverkonfiguration fehlerhaft.' }),
    };
  }
  console.log('DEBUG: RECAPTCHA_SECRET_KEY vorhanden? ', Boolean(process.env.RECAPTCHA_SECRET_KEY));

  // reCAPTCHA validieren
  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
    params.append('response', recaptchaToken);

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await verifyRes.json();
    console.log('DEBUG: reCAPTCHA-Antwort:', data);

    if (!data.success) {
      console.error('reCAPTCHA Validierung fehlgeschlagen:', data);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'reCAPTCHA Validierung fehlgeschlagen.' }),
      };
    }
    if (data.action && action && data.action !== action) {
      console.error('Ungültige reCAPTCHA-Aktion:', data.action, 'erwartet:', action);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Ungültige reCAPTCHA-Aktion.' }),
      };
    }
    const scoreThreshold = 0.5;
    if (typeof data.score === 'number' && data.score < scoreThreshold) {
      console.error('Zu geringes reCAPTCHA-Score:', data.score);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Zu geringes reCAPTCHA-Score.' }),
      };
    }
  } catch (err) {
    console.error('Fehler bei reCAPTCHA-Verifikation:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler bei reCAPTCHA-Verifikation.' }),
    };
  }

  // E-Mail versenden via SendGrid
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (!toEmail) {
    console.error('CONTACT_TO_EMAIL nicht gesetzt.');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Serverkonfiguration fehlerhaft (Empfänger fehlt).' }),
    };
  }
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || toEmail;

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject || 'Kontaktformular-Nachricht',
    text: `
Name: ${name}
Email: ${email}
Betreff: ${subject || '(kein Betreff)'}
Nachricht:
${message}
    `,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Betreff:</strong> ${subject || '(kein Betreff)'}</p>
           <p><strong>Nachricht:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error('Fehler beim Senden der E-Mail via SendGrid:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Senden der Nachricht.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
};
