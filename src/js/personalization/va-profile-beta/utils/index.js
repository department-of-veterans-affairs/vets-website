import { ADDRESS_TYPES } from '../../../letters/utils/constants';
import { toGenericAddress, inferAddressType } from '../../../letters/utils/helpers';

export { toGenericAddress };

export function expandGenericAddress(address) {
  const transformedAddress = inferAddressType(address);

  if (transformedAddress.type !== ADDRESS_TYPES.military) return transformedAddress;

  transformedAddress.militaryPostOfficeTypeCode = transformedAddress.city;
  transformedAddress.militaryStateCode = transformedAddress.stateCode;
  delete transformedAddress.city;
  delete transformedAddress.stateCode;
  delete transformedAddress.countryName;
  return transformedAddress;
}
