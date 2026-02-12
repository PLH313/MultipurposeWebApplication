import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, 
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export const sendVerificationEmail = async (
    email: string,
    verificationLink: string,
    name?: string
) => {
    const appName = "Multipurpose Web Application"; 
    
    const brandColor = "#2563EB"; 

    await transporter.sendMail({
        from: `"${appName} Support" <${process.env.EMAIL_FROM}>`, 
        to: email,
        subject: `Xác thực tài khoản ${appName}`, 
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                /* Reset cơ bản để hiển thị tốt trên mọi trình duyệt */
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background-color: ${brandColor}; padding: 24px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; }
                .content { padding: 32px; color: #333333; line-height: 1.6; }
                .button-container { text-align: center; margin: 32px 0; }
                .button { background-color: ${brandColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; }
                .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
                .link-text { color: ${brandColor}; word-break: break-all; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${appName}</h1>
                </div>

                <div class="content">
                    <h2 style="margin-top: 0; color: #111827;">Xin chào ${name || 'bạn'},</h2>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>${appName}</strong>. Để bảo mật tài khoản, vui lòng xác thực địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>
                    
                <div class="button-container">
                    <a href="${verificationLink}" 
                        target="_blank"
                        style="background-color: ${brandColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px; font-family: Arial, sans-serif;">
                        <span style="color: #ffffff; text-decoration: none;">Xác thực Email</span>
                    </a>
                </div>

                    <p>Link này sẽ hết hạn sau <strong>24 giờ</strong>.</p>
                    <p>Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.</p>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                    
                    <p style="font-size: 13px; color: #666;">
                        Nếu nút bên trên không hoạt động, hãy copy và dán link này vào trình duyệt:<br>
                        <a href="${verificationLink}" class="link-text">${verificationLink}</a>
                    </p>
                </div>

                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
                    <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                </div>
            </div>
        </body>
        </html>
        `
    })
}
