export const uniq = (arr, ignore) => {
  return arr.reduce((a, b) => {
    if(ignore !== b && a.includes(b)) return a
    return a.concat(b)
  }, [])
}


export const pollIsValid = ({ title, options }) => {
  
}