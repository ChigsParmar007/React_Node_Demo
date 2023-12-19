import { sendEmail } from './emailSend'

export const registerUserEmail = async (
	firstName: string,
	lastName: string,
	email: string
) => {
	const message = `Hey ${firstName} ${lastName},
        You have successfully registered in our Bloodbank App :)
        Thanks a lot for registering into our application \n    
        Safe blood is essential for helping people of all ages
        who suffer from diseases, disasters and accidents. Your
        donation saves lives and makes our community safe.
        Blood is always needed to save lives and treat people.
        Show your solidarity to the community and contribute with
        regular blood donations!
        you can now login here,
        'http://127.0.0.1:3000/user/login/user'`

	await sendEmail({
		email: email,
		subject: 'You have successfully registered into Bloodbank Application',
		message,
	})
}

export const registerBloodbankEmail = async (
	bloodbankName: string,
	email: string,
	password: string
) => {
	const message = `Hey ${bloodbankName}
        Welcome to our domain
        Your email: ${email}
        Your password: ${password}
        you can now login here,
        'http://127.0.0.1:3000/bloodbank/login/bloodbank'`

	await sendEmail({
		email: email,
		subject: 'You have successfully registered into Bloodbank Application',
		message,
	})
}

export const forgotPasswordEmail = async (
	resetToken: string,
	email: string = ''
) => {
	const resetURL = `http://127.0.0.1:5000/api/user/resetpassword/${resetToken}`

	await sendEmail({
		email: email,
		subject: 'Your password reset token (valid for only 10 minutes)',
		message: resetURL,
	})
}
