export const sessionOptions = {
  cookieName: 'connect.sid',
  password: process.env.SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}