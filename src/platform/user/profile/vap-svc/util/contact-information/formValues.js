import pickBy from 'lodash/pickBy';
import set from 'lodash/set';

import { ADDRESS_POU, ADDRESS_TYPES, FIELD_NAMES, USA } from '../../constants';
import {
  addresses,
  phoneNumbers,
  personalInformation,
} from '../getProfileInfoFieldAttributes';

import { createNotListedTextKey } from '../personal-information/personalInformationUtils';

const isOverseasMilitaryMailingAddress = data =>
  data?.addressPou === ADDRESS_POU.CORRESPONDENCE &&
  data?.addressType === ADDRESS_TYPES.OVERSEAS_MILITARY;

const transformBooleanArrayToFormValues = valuesAsArray => {
  return valuesAsArray?.reduce((previous, current) => {
    const result = { ...previous };
    result[current] = true;
    return result;
  }, {});
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
      const inputPhoneNumber =
        areaCode && phoneNumber
          ? `${areaCode}${phoneNumber}`
          : `${phoneNumber}`;

      initialFormValues = {
        ...data,
        extension: extension || '',
        inputPhoneNumber,
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

  if (personalInformation.includes(fieldName)) {
    // handle a single string type of field value
    if (fieldName === FIELD_NAMES.PREFERRED_NAME) {
      return (
        transformInitialFormValues(data) || {
          [FIELD_NAMES.PREFERRED_NAME]: '',
        }
      );
    }

    // return object with gender code for radio group field value
    if (fieldName === FIELD_NAMES.GENDER_IDENTITY) {
      return set({}, fieldName, data?.[fieldName]?.code);
    }

    const notListedTextKey = createNotListedTextKey(fieldName);

    // handle multi-select values plus additional 'write in' value if present
    return transformInitialFormValues({
      ...transformBooleanArrayToFormValues(data?.[fieldName]),
      ...(data?.[notListedTextKey] &&
        set({}, notListedTextKey, data?.[notListedTextKey])),
    });
  }

  return null;
};
