import { withIronSessionApiRoute } from 'iron-session/next'

export default withIronSessionApiRoute(
  async (req, res) => {
    req.session.user = {
      username: "Titus",
      id: '10943qw0',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu11YRUKXsaizAK5wr_gksi7JN17zHCz6snZGU7ve_yw&s'
    }
    await req.session.save()
    res.json({ ok: true })
  },
  {
    cookieName: 'connect.sid',
    password: process.env.SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV = 'production'
    }
  }
)