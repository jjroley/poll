import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/sessionOptions'

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
  sessionOptions
)