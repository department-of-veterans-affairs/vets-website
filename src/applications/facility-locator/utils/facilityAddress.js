import { compact } from 'lodash';

export function buildAddressArray(location) {
  const { address: { physical: address } } = location.attributes;

  return compact([
    address.address1,
    address.address2,
    address.address3,
    `${address.city}, ${address.state} ${address.zip}`
  ]);
}
