export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sentenceCase(str) {
  return str
    ?.split(' ')
    .map((word, index) => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      if (index === 0) {
        return `${word.charAt(0).toUpperCase()}${word
          .substr(1, word.length - 1)
          .toLowerCase()}`;
      }

      return word.toLowerCase();
    })
    .join(' ');
}

export function lowerCase(str = '') {
  return str
    .split(' ')
    .map(word => {
      if (/^[^a-z]*$/.test(word)) {
        return word;
      }

      return word.toLowerCase();
    })
    .join(' ');
}

export function joinWithAnd(items) {
  const start = items.slice(0, items.length - 1);

  return `${start.join(', ')} and ${items[items.length - 1]}`;
}

export function aOrAn(noun) {
  if (['a', 'e', 'i', 'o', 'u'].includes(noun[0].toLowerCase())) {
    return 'an';
  }

  return 'a';
}
