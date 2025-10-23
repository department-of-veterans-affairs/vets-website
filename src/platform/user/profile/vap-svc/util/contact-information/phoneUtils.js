import pickBy from 'lodash/pickBy';
import VaTextInputField from '~/platform/forms-system/src/js/web-component-fields/VaTextInputField';
import {
  internationalPhoneSchema,
  internationalPhoneUI,
} from '~/platform/forms-system/src/js/web-component-patterns/internationalPhonePattern';

import { PHONE_TYPE, USA } from '../../constants';

// Returns null or a cleaned string to match backend expectations
const normalizedPhoneValue = value => {
  if (!value) return null;
  // Convert to string and strip all non-numeric characters
  return String(value).replace(/[^\d]/g, '');
};

export const phoneFormSchema = ({ allowInternational = false } = {}) => {
  const extensionField = {
    type: 'string',
    pattern: '^\\s*[0-9-]{0,6}\\s*$',
    maxLength: 6,
  };

  if (allowInternational) {
    const baseSchema = internationalPhoneSchema({ required: true });
    return {
      type: 'object',
      properties: {
        'view:allowInternationalNumbers': {
          type: 'object',
          properties: {},
        },
        inputPhoneNumber: {
          ...baseSchema,
        },
        extension: extensionField,
      },
      required: ['inputPhoneNumber'],
    };
  }

  // Legacy view for NANP numbers only
  return {
    type: 'object',
    properties: {
      'view:noInternationalNumbers': {
        type: 'object',
        properties: {},
      },
      inputPhoneNumber: {
        type: 'string',
        pattern: '^[0-9-() ]+$',
        maxLength: 14,
        minLength: 10,
      },
      extension: extensionField,
    },
    required: ['inputPhoneNumber'],
  };
};

export const phoneUiSchema = (
  fieldName,
  { allowInternational = false } = {},
) => {
  if (allowInternational) {
    const baseUI = internationalPhoneUI(fieldName);
    delete baseUI['ui:reviewField'];
    delete baseUI['ui:confirmationField'];
    return {
      inputPhoneNumber: baseUI,
      extension: {
        'ui:title': 'Extension (6 digits maximum)',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          pattern: 'You must enter a valid extension up to 6 digits.',
        },
      },
    };
  }

  // Legacy ui schema
  return {
    inputPhoneNumber: {
      'ui:title': `${fieldName} (U.S. numbers only)`,
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [
        (errors, field) => {
          // checks that the phone number is at least 10 numerical digits
          const strippedPhone = normalizedPhoneValue(field);
          if (strippedPhone?.length !== 10) {
            errors.addError('Enter a 10 digit phone number');
          }
        },
      ],
      'ui:errorMessages': {
        pattern: 'Enter a 10 digit phone number',
      },
      'ui:autocomplete': 'tel',
      'ui:options': {
        inputType: 'tel',
        ariaDescribedby: 'error-message-details',
      },
    },
    extension: {
      'ui:title': 'Extension (6 digits maximum)',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        pattern: 'You must enter a valid extension up to 6 digits.',
      },
    },
  };
};

export const phoneConvertNextValueToCleanData = value => {
  const { id, extension = null, phoneType, inputPhoneNumber } = value;

  let areaCode = null;
  let phoneNumber = null;
  let countryCode = USA.COUNTRY_CODE; // Default to US country code '1'

  if (typeof inputPhoneNumber === 'string') {
    // Legacy string input
    const cleanedPhone = normalizedPhoneValue(inputPhoneNumber);
    areaCode = cleanedPhone.substring(0, 3);
    phoneNumber = cleanedPhone.substring(3);
  } else if (
    typeof inputPhoneNumber === 'object' &&
    inputPhoneNumber?.contact &&
    inputPhoneNumber?.callingCode
  ) {
    // Using VaTelephoneInput where inputPhoneNumber is an object
    const cleanedPhone = normalizedPhoneValue(inputPhoneNumber.contact);
    countryCode = normalizedPhoneValue(inputPhoneNumber.callingCode);

    // Don't set areaCode for international numbers
    if (countryCode === USA.COUNTRY_CODE) {
      areaCode = cleanedPhone.substring(0, 3);
      phoneNumber = cleanedPhone.substring(3);
    } else {
      phoneNumber = cleanedPhone;
    }
  }

  return {
    id,
    phoneType,
    inputPhoneNumber,
    countryCode,
    areaCode,
    phoneNumber,
    extension: normalizedPhoneValue(extension),
  };
};

export const phoneConvertCleanDataToPayload = (data, fieldName) => {
  let cleanData = data;
  if (data.inputPhoneNumber) {
    cleanData = phoneConvertNextValueToCleanData(data);
  }

  const { id, areaCode, countryCode, extension, phoneNumber } = cleanData;
  return pickBy(
    {
      id,
      areaCode,
      countryCode,
      extension,
      isInternational: countryCode ? countryCode !== USA.COUNTRY_CODE : false,
      phoneNumber,
      phoneType: PHONE_TYPE[fieldName],
    },
    e => !!e,
  );
};
