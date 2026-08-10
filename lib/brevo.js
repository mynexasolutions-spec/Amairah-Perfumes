const BRAND = {
  ink: "#12100e",
  ivory: "#f7f3ea",
  gold: "#caa14b",
  goldDark: "#8a6626",
  cardBg: "#1c1815",
  border: "#322a21",
};

export async function sendBrevoEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@amairahperfumes.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Amairah Perfumes";

  if (!apiKey) {
    console.log(`[DEV MODE EMAIL] To: ${to}, Subject: ${subject}\n${html}`);
    return { success: true };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Brevo API Error:", errText);
      return { error: "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (e) {
    console.error("Brevo send error:", e);
    return { error: "Failed to send email: " + e.message };
  }
}

function emailShell(heading, bodyHtml) {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid ${BRAND.border}; border-radius: 24px; background-color: ${BRAND.ink}; color: ${BRAND.ivory}; text-align: center;">
      <h1 style="color: ${BRAND.gold}; font-size: 22px; font-weight: bold; letter-spacing: 2px; margin: 0 0 24px; font-family: Georgia, serif;">AMAIRAH PERFUMES</h1>
      <hr style="border: 0; border-top: 1px solid ${BRAND.border}; margin: 0 0 24px;" />
      <h2 style="color: ${BRAND.ivory}; font-size: 19px; font-weight: 600; margin: 0 0 8px;">${heading}</h2>
      ${bodyHtml}
      <hr style="border: 0; border-top: 1px solid ${BRAND.border}; margin: 28px 0 20px;" />
      <p style="color: ${BRAND.gold}; opacity: 0.7; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} Amairah Perfumes. All rights reserved.</p>
    </div>
  `;
}

export function otpEmailHtml(otp) {
  return emailShell(
    "Verify your email",
    `
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 14px; line-height: 1.6; margin: 0 0 28px; max-width: 360px; margin-left: auto; margin-right: auto;">
        Enter the 6-digit code below to confirm your email and finish creating your account.
      </p>
      <div style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: ${BRAND.gold}; padding: 14px 28px; border: 1.5px solid ${BRAND.goldDark}; border-radius: 16px; background-color: ${BRAND.cardBg};">
        ${otp}
      </div>
      <p style="color: ${BRAND.ivory}; opacity: 0.5; font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
        This code is valid for 10 minutes.<br />If you did not request this, please ignore this email.
      </p>
    `
  );
}

export function resetPasswordEmailHtml(link) {
  return emailShell(
    "Reset your password",
    `
      <p style="color: ${BRAND.ivory}; opacity: 0.75; font-size: 14px; line-height: 1.6; margin: 0 0 28px; max-width: 360px; margin-left: auto; margin-right: auto;">
        We received a request to reset your Amairah Perfumes account password. Click the button below to choose a new one.
      </p>
      <a href="${link}" style="display: inline-block; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: ${BRAND.ink}; padding: 14px 32px; border-radius: 999px; background: linear-gradient(135deg, #a97c2f 0%, #f1d989 45%, #caa14b 70%, #8a6626 100%); text-decoration: none;">
        Reset Password
      </a>
      <p style="color: ${BRAND.ivory}; opacity: 0.5; font-size: 12px; line-height: 1.5; margin: 24px 0 0;">
        This link is valid for 30 minutes.<br />If you did not request this, please ignore this email — your password will not change.
      </p>
    `
  );
}
