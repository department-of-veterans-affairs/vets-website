import { compact } from 'lodash';

export function titleCase(str) {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function buildAddressArray(representative, titleCaseText = false) {
  if (representative && representative.attributes) {
    const {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      stateCode,
      zipCode,
    } = representative.attributes;

    return compact([
      titleCaseText ? titleCase(addressLine1) : addressLine1,
      titleCaseText ? titleCase(addressLine2) : addressLine2,
      titleCaseText ? titleCase(addressLine3) : addressLine3,
      `${titleCaseText ? titleCase(city) : city}, ${stateCode} ${zipCode}`,
    ]);
  }
  return '';
}

const acronyms = ['va', 'cvs'];

export function titleCaseRepresentativeName(str) {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(
      word =>
        acronyms.includes(word)
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}
