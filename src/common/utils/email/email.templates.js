import { EmailsubjectEnum } from "../../enum/index.js"

export const templates = {
    [EmailsubjectEnum.CONFIRM_EMAIL]:(data)=>{
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Email</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial,Helvetica,sans-serif;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f4f6fb; padding:40px 12px;">
        <tr>
          <td align="center">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
              style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">

              <tr>
                <td align="center"
                  style="background-color:#4f46e5; padding:30px 20px; color:#ffffff;">
                  <h1 style="margin:0; font-size:26px;">Welcome!</h1>
                  <p style="margin:10px 0 0; font-size:15px;">
                    We're happy to have you here.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:35px 30px; color:#333333;">

                  <h2 style="margin:0 0 15px; font-size:40px;">
                    ${data.code}
                  </h2>

                  <p style="font-size:15px; line-height:1.7; color:#555555;">
                    Thank you for creating an account. Please confirm your email
                    address to activate your account and get started.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0"
                    style="margin:28px auto;">
                    <tr>
                      <td align="center" bgcolor="#4f46e5"
                        style="border-radius:7px;">
                        <a href="${data.confirmationLink}"
                          style="display:inline-block; padding:14px 28px;
                          color:#ffffff; text-decoration:none; font-size:15px;
                          font-weight:bold;">
                          Confirm My Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:13px; line-height:1.6; color:#777777;">
                    If the button doesn't work, copy and paste this link into
                    your browser:
                  </p>

                  <p style="font-size:13px; line-height:1.6; word-break:break-all;">
                    <a href="${data.confirmationLink}" style="color:#4f46e5;">
                      ${data.confirmationLink}
                    </a>
                  </p>

                  <p style="font-size:13px; line-height:1.6; color:#777777;">
                    If you didn't create this account, you can safely ignore
                    this email.
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center"
                  style="background-color:#f9fafb; padding:20px; color:#888888;
                  font-size:12px;">
                  This is an automated email. Please do not reply.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `},
  [EmailsubjectEnum.FORGET_PASSWORD]:(data)=>{
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Your Email</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial,Helvetica,sans-serif;">

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        style="background-color:#f4f6fb; padding:40px 12px;">
        <tr>
          <td align="center">

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
              style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden;">

              <tr>
                <td align="center"
                  style="background-color:#4f46e5; padding:30px 20px; color:#ffffff;">
                  <h1 style="margin:0; font-size:26px;">Welcome!</h1>
                  <p style="margin:10px 0 0; font-size:15px;">
                    We're happy to have you here.
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:35px 30px; color:#333333;">

                  <h2 style="margin:0 0 15px; font-size:40px;">
                    ${data.code}
                  </h2>

                  <p style="font-size:15px; line-height:1.7; color:#555555;">
                    Thank you for creating an account. Please confirm your email
                    address to activate your account and get started.
                  </p>

                  <table role="presentation" cellspacing="0" cellpadding="0"
                    style="margin:28px auto;">
                    <tr>
                      <td align="center" bgcolor="#4f46e5"
                        style="border-radius:7px;">
                        <a href="${data.confirmationLink}"
                          style="display:inline-block; padding:14px 28px;
                          color:#ffffff; text-decoration:none; font-size:15px;
                          font-weight:bold;">
                          Confirm My Email
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:13px; line-height:1.6; color:#777777;">
                    If the button doesn't work, copy and paste this link into
                    your browser:
                  </p>

                  <p style="font-size:13px; line-height:1.6; word-break:break-all;">
                    <a href="${data.confirmationLink}" style="color:#4f46e5;">
                      ${data.confirmationLink}
                    </a>
                  </p>

                  <p style="font-size:13px; line-height:1.6; color:#777777;">
                    If you didn't create this account, you can safely ignore
                    this email.
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center"
                  style="background-color:#f9fafb; padding:20px; color:#888888;
                  font-size:12px;">
                  This is an automated email. Please do not reply.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
  `}
}


export const getConfirmationEmail = (data) => {
  return templates[data.subject](data)
}
