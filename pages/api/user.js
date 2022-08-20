import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from '../../lib/sessionOptions'

function user(req, res) {
  console.log(req.session)
  if(req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true
    })
  }else {
    res.json({
      isLoggedIn: false
    })
  }
}

export default withIronSessionApiRoute(user, sessionOptions)