import { compact } from 'lodash';

export function titleCase(str) {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function buildAddressArray(location, titleCaseText = false) {
  if (location && location.attributes) {
    const {
      address: { physical: address },
    } = location.attributes;

    return compact([
      titleCaseText ? titleCase(address.address1) : address.address1,
      titleCaseText ? titleCase(address.address2) : address.address2,
      titleCaseText ? titleCase(address.address3) : address.address3,
      `${titleCaseText ? titleCase(address.city) : address.city}, ${
        address.state
      } ${address.zip}`,
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
