import { ADDRESS_POU, USA } from '@@vap-svc/constants';
import ADDRESS_DATA from '~/platform/forms/address/data';
import pickBy from 'lodash/pickBy';

/**
 * Returns a copy of the input object with an added `view:livesOnMilitaryBase`
 * value if the address is a overseas military mailing address
 *
 */
const livesOnMilitaryBase = data => {
  if (
    data?.addressPou === ADDRESS_POU.CORRESPONDENCE &&
    ADDRESS_DATA.militaryStates.includes(data?.stateCode) &&
    ADDRESS_DATA.militaryCities.includes(data?.city)
  ) {
    return true;
  }
  return false;
};

/**
 * Helper function that calls other helpers to:
 * - totally remove data fields that are not set
 * - set the form data's `view:livesOnMilitaryBase` prop to `true` if this is
 *   an overseas military mailing address
 *
 * If the argument is not an object this function will simply return whatever
 * was passed to it.
 */
export const transformInitialFormValues = initialFormValues => {
  if (!(initialFormValues instanceof Object)) {
    return initialFormValues;
  }
  // totally removes data fields with falsey values from initialFormValues
  // to prevent form validation errors.
  const transformedData = pickBy(initialFormValues);
  if (livesOnMilitaryBase(transformedData)) {
    transformedData['view:livesOnMilitaryBase'] = true;
  }
  return transformedData;
};

export const getInitialFormValues = options => {
  const { type, data, showSMSCheckbox, modalData } = options;
  if (type === 'email') {
    return data ? { ...data } : { emailAddress: '' };
  }

  if (type === 'phone') {
    let initialFormValues = {
      countryCode: '1',
      extension: '',
      inputPhoneNumber: '',
      isTextable: false,
      isTextPermitted: false,
      'view:showSMSCheckbox': showSMSCheckbox,
    };

    if (data) {
      const { extension, areaCode, phoneNumber, isTextPermitted } = data;

      initialFormValues = {
        ...data,
        extension: extension || '',
        inputPhoneNumber: `${areaCode}${phoneNumber}`,
        isTextPermitted: isTextPermitted || false,
        'view:showSMSCheckbox': showSMSCheckbox,
      };
    }

    return initialFormValues;
  }

  if (type === 'address') {
    return (
      modalData ||
      transformInitialFormValues(data) || {
        countryCodeIso3: USA.COUNTRY_ISO3_CODE,
      }
    );
  }

  return null;
};
