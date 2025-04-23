import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export const sendVerificationEmail = async (
    email: string,
    verificationLink: string,
    name?: string  // Make name optional
) => {
    await transporter.sendMail({
        from: `"Your App" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Verify Your Email',
        html: `
      <h1>Hello ${name || 'User'},</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
    })
}