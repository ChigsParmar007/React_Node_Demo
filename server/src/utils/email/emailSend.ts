const nodemailer = require('nodemailer')

export const sendEmail = async (options: any) => {
	// validation of who is sending and authorization to send email
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	})

	// 2) defining whom to send and all other options (header, message, etc.)
	const mailOptions = {
		from: process.env.EMAIL_USERNAME,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}
	// 3) now actually send the email
	return await transporter.sendMail(
		mailOptions,
		(error: any, info: any, next: any) => {
			if (error) {
				console.log('error', error)
			}
		}
	)
}
