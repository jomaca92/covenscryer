export const formatAttr = (str) => {
    return str.split(" ").map((word, i) => {
      if (["of", "the", "and"].includes(word) && i) // never capitalize these words unless its the first word (ex: 'The')
        return word
      else if (word.substring(0,1) == '(')
        return `(${word.substring(1,2).toUpperCase()}${word.substring(2)}`
      else
        return `${word.substring(0,1).toUpperCase()}${word.substring(1)}`
    }).join(" ")
}