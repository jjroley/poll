
export default function handler(req, res) {
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