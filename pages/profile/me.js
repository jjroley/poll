

export default function Me() {
  return null
}

export function getServerSideProps({ req }) {
  const username = req.headers['x-replit-user-name']
  return {
    redirect: {
      destination: username ? `/profile/${username}` : '/login'
    }
  }
}