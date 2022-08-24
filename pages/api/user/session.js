
export default async function handler(req, res) {
  if(!req.headers['x-replit-user-id']) {
    return res.json({
      loggedIn: false
    })
  }
  res.json({
    id: req.headers['x-replit-user-id'],
    username: req.headers['x-replit-user-name'],
    image: req.headers['x-replit-user-profile-image'],
    loggedIn: true
  })
}