import { compact, isEmpty } from 'lodash';
import { LocationType } from '../constants';

export function titleCase(str) {
  if (!str) return null;

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function buildAddressArray(location, titleCaseText = false) {
  if (location && location.type === LocationType.CC_PROVIDER) {
    const { address } = location.attributes;

    if (!isEmpty(address)) {
      return compact([
        titleCaseText ? titleCase(address.street) : address.street,
        address.appt,
        `${titleCaseText ? titleCase(address.city) : address.city}, ${
          address.state
        } ${address.zip}`,
      ]);
    }

    return [];
  }
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

export function titleCaseFacilityName(str) {
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
