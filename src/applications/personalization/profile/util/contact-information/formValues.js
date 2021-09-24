import {
  ADDRESS_POU,
  ADDRESS_TYPES,
  FIELD_NAMES,
  USA,
} from '@@vap-svc/constants';
import { addresses, phoneNumbers } from './getContactInfoFieldAttributes';
import pickBy from 'lodash/pickBy';

const isOverseasMilitaryMailingAddress = data =>
  data?.addressPou === ADDRESS_POU.CORRESPONDENCE &&
  data?.addressType === ADDRESS_TYPES.OVERSEAS_MILITARY;

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
  if (isOverseasMilitaryMailingAddress(transformedData)) {
    transformedData['view:livesOnMilitaryBase'] = true;
  }
  return transformedData;
};

export const getInitialFormValues = options => {
  const { fieldName, data, modalData } = options;

  if (fieldName === FIELD_NAMES.EMAIL) {
    return data ? { ...data } : { emailAddress: '' };
  }

  if (phoneNumbers.includes(fieldName)) {
    let initialFormValues = {
      countryCode: '1',
      extension: '',
      inputPhoneNumber: '',
    };

    if (data) {
      const { extension, areaCode, phoneNumber } = data;

      initialFormValues = {
        ...data,
        extension: extension || '',
        inputPhoneNumber: `${areaCode}${phoneNumber}`,
      };
    }

    return initialFormValues;
  }

  if (addresses.includes(fieldName)) {
    return (
      modalData ||
      transformInitialFormValues(data) || {
        countryCodeIso3: USA.COUNTRY_ISO3_CODE,
      }
    );
  }

  return null;
};
