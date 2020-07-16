export function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sentenceCase(str) {
  return str
    .split(' ')
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

/**
 * Returns formatted address from facility details object
 *
 * @param {*} facility - facility details object
 */
export function formatFacilityAddress(facility) {
  return `${facility.address?.line.join(', ')}, ${facility.address?.city}, ${
    facility.address?.state
  } ${facility.address?.postalCode}`;
}
