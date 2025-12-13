import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'Art.drop.015@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'awmp maey pugd cjqa'
  }
});

export const sendPasswordResetEmail = async (name, email, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Cheifs" <${process.env.GMAIL_USER || 'Art.drop.015@gmail.com'}>`,
    to: email,
    subject: 'Reset Your Password - Chiefs.io',
    html: `
      <!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
        background-color: #0f0f0f;
        line-height: 1.6;
      }
      .parent {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
        background: url("https://i.postimg.cc/YCNcRDLW/Untitled_1_removebg_preview.png");
      }
      .cont {
        max-width: 600px;
        width: 100%;
        background: #ccc;
        padding: 48px 40px;
        border-radius: 10px;
      }
      header {
        text-align: center;
        margin-bottom: 32px;
        border-bottom: 2px solid rgba(206, 144, 0, 0.2);
        padding-bottom: 24px;
      }
      h1 {
        color: #ce9000;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      h4 {
        color: #2c2c2c;
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      p {
        color: #4a4a4a;
        font-size: 15px;
        margin-bottom: 16px;
      }
      #btn {
        display: block;
        width: fit-content;
        margin: 32px auto;
        padding: 16px 48px;
        background: #ce9000;
        color: #dddd;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        border: none;
      }
      #btn:hover {
        transform: translateY(-2px);
        background: #b07c00;
      }
      .divider {
        text-align: center;
        margin: 32px 0;
        position: relative;
      }
      .divider::before,
      .divider::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 40%;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
      }
      .divider::before {
        left: 0;
      }
      .divider::after {
        right: 0;
      }
      .divider p {
        display: inline-block;
        padding: 0 16px;
        color: #6b7280;
        font-weight: 600;
        font-size: 14px;
        margin: 0;
      }
      .url-box {
        background: rgba(0, 0, 0, 0.03);
        border: 2px dashed rgba(206, 144, 0, 0.3);
        border-radius: 12px;
        padding: 16px;
        word-break: break-all;
        color: #1e40af;
        font-size: 14px;
        font-family: "Courier New", monospace;
        margin: 24px 0;
      }
      .footer-note {
        text-align: center;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        color: #6b7280;
        font-size: 14px;
      }
      footer {
        padding: 15px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      footer .img {
        width: 150px;
        height: 150px;
        background: url("https://i.postimg.cc/j5Gsj3G6/Warden.png") no-repeat
          center/cover;
      }
      .img,
      span {
        display: block;
        text-align: center;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
      }
      @media (max-width: 600px) {
        .cont {
          padding: 32px 24px;
        }
        h1 {
          font-size: 26px;
        }
        h4 {
          font-size: 16px;
        }
        #btn {
          padding: 14px 36px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="parent">
      <div class="cont">
        <header>
          <h1>Hi there, ${name}</h1>
        </header>
        <main>
          <h4>
            Everyone forgets their password sometimes—don't worry, we've got you
            covered.
          </h4>

          <p>Click the button below to reset your password securely:</p>

          <a href="${resetUrl}" id="btn">Reset Password</a>

          <div class="divider">
            <p>OR</p>
          </div>

          <p>Copy and paste the following link into your browser:</p>

          <div class="url-box">${resetUrl}</div>

          <div class="footer-note">
            <p>
              If you did not request this password reset, please ignore this
              email and your password will remain unchanged.
            </p>
          </div>
        </main>
        <footer>
          <div class="img"></div>
          <span><p>Regards from Cheif's.io</p></span>
        </footer>
      </div>
    </div>
  </body>
</html>

    `
  };

  try {
    console.log('Sending password reset email to:', email);
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};
