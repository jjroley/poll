export const uniq = (arr, ignore) => {
  return arr.reduce((a, b) => {
    if (ignore !== b && a.includes(b)) return a
    return a.concat(b)
  }, [])
}

export const objUniq = (arr, key) => {
  return arr.reduce((a, b) => {
    if (a.find(l => l[key] === b[key])) return a
    return a.concat(b)
  }, [])
}

export const pollIsInvalid = ({ title, options }) => {
  let error;
  if (title.length > 100) {
    error = 'Title is too long'
  }
  else if (options.length < 2) {
    error = 'At least two options needed'
  }
  else if (options.length > 10) {
    error = 'There must be 10 options or less'
  }
  else if (uniq(options, '').length !== options.length) {
    error = "Duplicate options"
  }
  else if (options.some(o => o.length > 50)) {
    error = "One or more options is too long"
  }
  if (error) return { error }
  const success = (
    title.length <= 100 &&
    title.length &&
    options.length > 1 &&
    options.length <= 10 &&
    options.every(o => o !== '')
  )
  return { success }
}

export const getSerializedPollData = (poll) => {
  return { 
    title: poll.title, 
    official: poll.official, 
    options: poll.options,
    votes: poll.votes.map(v => ({ index: v.index, uid: v.uid })), 
    createdBy: poll.createdBy, 
    createdAt: poll.createdAt.toString(),
    _id: poll._id.toString()
  }
}