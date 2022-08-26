export const uniq = (arr, ignore) => {
  return arr.reduce((a, b) => {
    if(ignore !== b && a.includes(b)) return a
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
  if(error) return { error }
  const success = (
    title.length <= 100 &&
    title.length &&
    options.length > 1 &&
    options.length <= 10 &&
    options.every(o => o.value !== '')
  )
  return { success }
}