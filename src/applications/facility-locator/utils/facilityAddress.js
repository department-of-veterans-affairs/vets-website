import { compact, isEmpty } from 'lodash';
import { LocationType } from '../constants';
import { titleCase } from 'applications/vaos/utils/formatters';

export function buildAddressArray(location) {
  if (location.type === LocationType.CC_PROVIDER) {
    const { address } = location.attributes;

    if (!isEmpty(address)) {
      return compact([
        titleCase(address.street),
        address.appt,
        `${titleCase(address.city)}, ${address.state} ${address.zip}`,
      ]);
    }

    return [];
  }

  const {
    address: { physical: address },
  } = location.attributes;

  return compact([
    titleCase(address.address1),
    titleCase(address.address2),
    titleCase(address.address3),
    `${titleCase(address.city)}, ${address.state} ${address.zip}`,
  ]);
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
