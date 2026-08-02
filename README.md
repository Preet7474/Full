# EpicPassManager

EpicPass-Manager is a full-stack password manager built with React on the frontend and Node.js, Express, and MongoDB on the backend. It also includes OTP-based email verification for both registration and login, making the authentication flow more secure.

## Features

- Secure user registration with OTP verification
- Secure login with OTP verification
- Add, view, edit, and delete saved passwords
- Encrypt stored passwords before saving them
- Reset all saved passwords for the logged-in user
- View user profile details and saved password count
- Responsive UI with toast notifications
- Resend OTP with a short cooldown period

## Authentication Flow

### Registration
1. User fills in name, email, and password.
2. An OTP is generated and sent to the provided email.
3. The user enters the OTP on the verification page.
4. Once verified, the account is activated.

### Login
1. User enters email and password.
2. If the credentials are valid, an OTP is sent to the email.
3. The user enters the OTP on the verification page.
4. After successful verification, the user is logged in.

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt
- crypto-js
- nodemailer

## Project Structure

- Frontend: React application in the root folder
- Backend: Express server in the Backend folder
- Database: MongoDB collections for users and stored passwords

## Getting Started

### 1. Install dependencies

Install frontend dependencies:

```bash
cd Frontend
npm install
```

Install backend dependencies:

```bash
cd Backend
npm install
```

### 2. Configure environment variables

Create a .env file inside the Backend folder with the following values:

```env
Mongo_URI=your_mongodb_connection_string
PASSWORD_SECRET=your_secret_key
BREVO_USER=your_brevo_login
BREVO_PASS=your_brevo_password
BREVO_SENDER=your_verified_sender_email
```

> The OTP emails are sent using Brevo (formerly Sendinblue), so the Brevo credentials must be configured correctly.

### 3. Run the app

Start the backend server:

```bash
cd Backend
npm start
```

Start the frontend development server:

```bash
cd Frontend
npm run dev
```

For Starting directly from ROOT Folder:

### Frontend
```bash
npm run frontend
```
### Backend
```bash
npm run backend
```
#### Run Both Together
```bash
npm run dev
```

Then open your browser at:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Notes

- Make sure MongoDB is running and accessible before starting the backend.
- OTPs are valid for 5 minutes.
- OTP resend is limited to avoid abuse and is allowed again after about 30 seconds.
- This project is ideal for learning full-stack development, authentication, email verification, CRUD operations, and secure data handling.

## License

This project is for educational and personal use.
