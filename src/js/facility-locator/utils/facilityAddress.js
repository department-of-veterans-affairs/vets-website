import { compact } from 'lodash';

export function buildAddressArray(facility) {
  const { address: { physical: address } } = facility.attributes;

  return compact([
    address.address_1,
    address.address_2,
    address.address_3,
    `${address.city}, ${address.state} ${address.zip}`
  ]);
}
