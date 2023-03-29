// Porting Code from https://github.com/lodash/lodash/blob/master/uniqueId.js
const idCounter = {}
export function uniqueId(prefix='uniqueIdDefault') {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0
  }

  const id =++idCounter[prefix]
  if (prefix === 'uniqueIdDefault') {
    return `${id}`
  }

  return `${prefix}${id}`
}

export function isString(str) {
  return typeof str?.valueOf() === 'string';
}
