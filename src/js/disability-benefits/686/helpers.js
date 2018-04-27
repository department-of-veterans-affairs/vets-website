const numberToWords = {
  0: 'First',
  1: 'Second',
  2: 'Third',
  3: 'Fourth',
  4: 'Fifth',
  5: 'Sixth',
  6: 'Seventh',
  7: 'Eighth',
  8: 'Ninth',
  9: 'Tenth'
};

export function getMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `${desc} marriage` : `Marriage ${index + 1}`;
}

export function getSpouseMarriageTitle(index) {
  const desc = numberToWords[index];

  return desc ? `Spouse’s ${desc.toLowerCase()} marriage` : `Spouse marriage ${index + 1}`;
}
