export function verifyEmailTemplate(otp: string) {
  return `
<!DOCTYPE html>
<html>
<body style=" margin:0; padding:0; background:#191919; font-family:Inter,Arial,sans-serif; color:#ffffff; " >
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;" >
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style=" background:#1f1f1f; border:1px solid #2a2a2a; border-radius:20px; padding:40px; " >
<tr>
<td align="center">
<div style=" display:inline-block; padding:8px 16px; border:1px solid #333; border-radius:999px; background:#222; color:#a1a1aa; font-size:13px; margin-bottom:24px; " >
🚀 DSA Tracker
</div>

                <h1
                  style="
                    margin:0;
                    font-size:32px;
                    font-weight:700;
                    line-height:1.3;
                    color:#ffffff;
                  "
                >
                  Verify your email
                </h1>

                <p
                  style="
                    margin:16px 0 32px;
                    color:#a1a1aa;
                    font-size:16px;
                    line-height:1.6;
                  "
                >
                  Welcome to DSA Tracker. Use the verification code below
                  to complete your account setup.
                </p>

                <div
                  style="
                    background:#111111;
                    border:1px solid #333333;
                    border-radius:16px;
                    padding:24px;
                    margin:24px 0;
                  "
                >
                  <div
                    style="
                      font-size:40px;
                      font-weight:700;
                      letter-spacing:12px;
                      color:#ffffff;
                    "
                  >
                    ${otp}
                  </div>
                </div>

                <p
                  style="
                    color:#a1a1aa;
                    font-size:14px;
                    margin-top:24px;
                  "
                >
                  This verification code will expire in
                  <strong style="color:#ffffff">
                    10 minutes
                  </strong>.
                </p>

                <hr
                  style="
                    border:none;
                    border-top:1px solid #2a2a2a;
                    margin:32px 0;
                  "
                />

                <p
                  style="
                    color:#71717a;
                    font-size:12px;
                    line-height:1.6;
                    margin:0;
                  "
                >
                  If you didn't request this email, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>

          <p
            style="
              color:#71717a;
              font-size:12px;
              margin-top:20px;
            "
          >
            © ${new Date().getFullYear()} DSA Tracker
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
}
