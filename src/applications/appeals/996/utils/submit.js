import { CONFERENCE_TIMES_V2_5 } from '../constants';

import { MAX_LENGTH } from '../../shared/constants';
import '../../shared/definitions';
import { replaceSubmittedData } from '../../shared/utils/replace';
import { removeEmptyEntries, getIso2Country } from '../../shared/utils/submit';

const nonDigitRegex = /[^\d]/g;

export const getRep = formData => {
  if (formData.informalConference !== 'rep') {
    return null;
  }
  const phoneNumber = (formData?.informalConferenceRep?.phone || '').replace(
    nonDigitRegex,
    '',
  );
  const phone = {
    countryCode: '1',
    areaCode: phoneNumber.substring(0, 3),
    phoneNumber: phoneNumber.substring(3),
    phoneNumberExt: formData.informalConferenceRep.extension || '',
  };

  // Empty string/null are not permitted values
  return removeEmptyEntries({
    firstName: formData?.informalConferenceRep?.firstName.substring(
      0,
      MAX_LENGTH.HLR_REP_FIRST_NAME,
    ),
    lastName: formData?.informalConferenceRep?.lastName.substring(
      0,
      MAX_LENGTH.HLR_REP_LAST_NAME,
    ),
    phone: removeEmptyEntries(phone),
    email: (formData.informalConferenceRep.email || '').substring(
      0,
      MAX_LENGTH.EMAIL,
    ),
  });
};

// schema v2 & v2.5
export const getConferenceTime = (formData = {}) => {
  const { informalConferenceTime = '' } = formData;
  return CONFERENCE_TIMES_V2_5[informalConferenceTime]?.submit || '';
};

export const getContact = ({ informalConference }) => {
  if (informalConference === 'rep') {
    return 'representative';
  }
  if (informalConference === 'me') {
    return 'veteran';
  }
  return '';
};

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
  // note "ISO2" is submitted, "Iso2" is from profile address
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
    addressLine1: truncate('addressLine1', MAX_LENGTH.ADDRESS_LINE1),
    addressLine2: truncate('addressLine2', MAX_LENGTH.ADDRESS_LINE2),
    addressLine3: truncate('addressLine3', MAX_LENGTH.ADDRESS_LINE3),
    city: truncate('city', MAX_LENGTH.CITY),
    stateCode: veteran.address?.stateCode || '',
    countryCodeISO2,
    zipCode5,
    internationalPostalCode,
  });
};
