import { compact } from 'lodash';

export function buildAddressArray(facility) {
  const { address: { physical: address }, facility_type: facilityType } = facility.attributes;

  switch (facilityType) {
    case 'va_health_facility':
      return [
        compact([address.building, address.street, address.suite]).join(' '),
        `${address.city}, ${address.state} ${address.zip}`
      ];
    case 'va_cemetery':
      return compact([
        address.address1,
        address.address2,
        `${address.city}, ${address.state} ${address.zip}`
      ]);
    default:
      return [];
  }
}
