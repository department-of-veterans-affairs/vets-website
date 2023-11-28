import { compact } from 'lodash';

export function titleCase(str) {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/* eslint-disable camelcase */
export function buildAddressArray(representative, titleCaseText = false) {
  if (representative && representative.attributes) {
    const {
      address_line_1,
      address_line_2,
      address_line_3,
      city,
      state_code,
      zip_code,
    } = representative.attributes;

    return compact([
      titleCaseText ? titleCase(address_line_1) : address_line_1,
      titleCaseText ? titleCase(address_line_2) : address_line_2,
      titleCaseText ? titleCase(address_line_3) : address_line_3,
      `${titleCaseText ? titleCase(city) : city}, ${state_code} ${zip_code}`,
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
