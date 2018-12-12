import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import { LocationType } from '../constants';

export function buildAddressArray(location) {
  if (location.type === LocationType.CC_PROVIDER) {
    const { address } = location.attributes;

    if (!isEmpty(address)) {
      return compact([
        address.street,
        address.appt,
        `${address.city}, ${address.state} ${address.zip}`,
      ]);
    }

    return [];
  }

  const {
    address: { physical: address },
  } = location.attributes;

  return compact([
    address.address1,
    address.address2,
    address.address3,
    `${address.city}, ${address.state} ${address.zip}`,
  ]);
}
