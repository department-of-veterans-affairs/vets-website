function transformCsvToScsv(string) {
  const DELINEATOR = ';';
  const OPENING_CHARS = ['[', '{', '('];
  const CLOSING_CHARS = [']', '}', ')'];
  const openingCharTracker = [];

  let scsv = '';

  for (let i = 0; i < string.length; i += 1) {
    const currentChar = string[i];

    if (currentChar === ',' && openingCharTracker.length === 0) {
      scsv += DELINEATOR;
      // eslint-disable-next-line no-continue
      continue;
    }

    if (
      OPENING_CHARS.includes(currentChar) ||
      (currentChar === '"' && openingCharTracker.slice(-1)[0] !== '"')
    ) {
      openingCharTracker.push(currentChar);
    } else if (
      CLOSING_CHARS.includes(currentChar) ||
      (currentChar === '"' && openingCharTracker.slice(-1)[0] === '"')
    ) {
      openingCharTracker.pop();
    }

    scsv += currentChar === ';' ? ',' : currentChar;
  }

  return scsv;
}

// Removes the '\r' if it exists at the end of the string
function removeCarriageReturn(array) {
  return array.map(line => {
    if (line.endsWith('\r')) {
      return line.substring(0, line.length - 1);
    }

    return line;
  });
}

module.exports = { transformCsvToScsv, removeCarriageReturn };
