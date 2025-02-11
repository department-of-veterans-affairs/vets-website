import { PRIMARY_PHONE } from '../../constants';
import {
  hasHomeAndMobilePhone,
  hasHomePhone,
  hasMobilePhone,
} from '../contactInfo';

import { MAX_LENGTH } from '../../../shared/constants';
import '../../../shared/definitions';
import { replaceSubmittedData } from '../../../shared/utils/replace';
import {
  removeEmptyEntries,
  getIso2Country,
} from '../../../shared/utils/submit';

/**
 * FormData
 * @typedef {Object}
 * @property {Veteran} veteran - Veteran formData object
 */
/**
 * Strip out extra profile home address data & rename zipCode to zipCode5
 * @param {FormData} formData
 * @returns {AddressSubmittableV2}
 */
export const getAddress = formData => {
  const { veteran = {} } = formData || {};
  const truncate = (value, max) =>
    replaceSubmittedData(veteran.address?.[value] || '').substring(0, max);
  // user profile provides "Iso2", whereas Lighthouse wants "ISO2"
  const countryCodeISO2 = getIso2Country(veteran.address).substring(
    0,
    MAX_LENGTH.ADDRESS_COUNTRY,
  );
  // international postal code can be undefined/null
  const internationalPostalCode = truncate(
    'internationalPostalCode',
    MAX_LENGTH.POSTAL_CODE,
  );
  // zipCode5 is always required, set to 00000 for addresses outside the U.S.
  // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/shared/v0/address.json#L34
  const zipCode5 =
    countryCodeISO2 !== 'US'
      ? '00000'
      : truncate('zipCode', MAX_LENGTH.ZIP_CODE5);
  return removeEmptyEntries({
    // Long addresses will overflow to an attachment page
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    // stateCode is from enum
    stateCode: truncate('stateCode'),
    countryCodeISO2,
    // https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/shared/v0/address.json#L34
    zipCode5,
    internationalPostalCode,
  });
};

/**
 * Strip out extra profile phone data
 * @param {Veteran} veteran - Veteran formData object
 * @returns {Object} submittable address
 */

// NOTE: This one stays in 995 because 995 includes a mobile phone number while 996 and 10182 do not
export const getPhone = formData => {
  const data = formData || {};
  const { veteran = {} } = data;
  const primary = data[PRIMARY_PHONE] || '';
  // we shouldn't ever get to this point without a home or mobile phone
  let phone;
  if (hasHomeAndMobilePhone(data) && primary) {
    phone = `${primary}Phone`;
  } else if (hasMobilePhone(data)) {
    phone = 'mobilePhone';
  } else if (hasHomePhone(data)) {
    phone = 'homePhone';
  }

  const truncate = (value, max) =>
    replaceSubmittedData(veteran[phone]?.[value] || '').substring(0, max);
  return phone
    ? removeEmptyEntries({
        countryCode: truncate('countryCode', MAX_LENGTH.PHONE_COUNTRY_CODE),
        areaCode: truncate('areaCode', MAX_LENGTH.PHONE_AREA_CODE),
        phoneNumber: truncate('phoneNumber', MAX_LENGTH.PHONE_NUMBER),
        phoneNumberExt: truncate('extension', MAX_LENGTH.PHONE_NUMBER_EXT),
      })
    : {};
};

/**
 * Truncate long email addresses
 * @param {Veteran} veteran - Veteran formData object
 * @returns {String} submittable email address
 */
export const getEmail = formData => {
  const { veteran } = formData || {};
  return (veteran?.email || '').substring(0, MAX_LENGTH.EMAIL);
};
