import pickBy from 'lodash/pickBy';
import VaTextInputField from '~/platform/forms-system/src/js/web-component-fields/VaTextInputField';
import VaTelephoneInputField from '../../../../../forms-system/src/js/web-component-fields/VaTelephoneInputField';

import { PHONE_TYPE, USA } from '../../constants';

export const phoneFormSchema = ({ allowInternational = true } = {}) => {
  const extensionField = {
    type: 'string',
    pattern: '^\\s*[0-9-]{0,6}\\s*$',
    maxLength: 6,
  };

  if (allowInternational) {
    return {
      type: 'object',
      properties: {
        'view:allowInternationalNumbers': {
          type: 'object',
          properties: {},
        },
        inputPhoneNumber: {
          type: 'object',
          properties: {
            contact: { type: 'string' },
            callingCode: { type: 'string' },
            countryCode: { type: 'string' },
          },
          required: ['contact', 'callingCode', 'countryCode'],
        },
        extension: extensionField,
      },
      required: ['inputPhoneNumber'],
    };
  }

  // Legacy view for U.S. numbers only
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
    return {
      inputPhoneNumber: {
        'ui:title': `${fieldName}`,
        'ui:webComponentField': VaTelephoneInputField,
        'ui:errorMessages': {
          pattern: 'Please enter a valid phone number',
        },
        // 'ui:autocomplete': 'tel',
        'ui:options': {
          // inputType: 'tel',
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
  }

  return {
    inputPhoneNumber: {
      'ui:title': `${fieldName} (U.S. numbers only)`,
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [
        (errors, field) => {
          // checks that the phone number is at least 10 numerical digits
          const strippedPhone = field?.replace(/[^0-9]/g, '');
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
  const { id, countryCode, extension, phoneType, inputPhoneNumber } = value;

  const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
  const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

  return {
    id,
    areaCode: strippedPhone.substring(0, 3),
    countryCode,
    extension: strippedExtension,
    inputPhoneNumber,
    isInternational: countryCode !== USA.COUNTRY_CODE,
    phoneNumber: strippedPhone.substring(3),
    phoneType,
  };
};

export const phoneConvertCleanDataToPayload = (data, fieldName) => {
  let cleanData = data;
  if (data.inputPhoneNumber) {
    cleanData = phoneConvertNextValueToCleanData(data);
  }
  return pickBy(
    {
      id: cleanData.id,
      areaCode: cleanData.areaCode,
      countryCode: USA.COUNTRY_CODE, // currently no international phone number support
      extension: cleanData.extension,
      isInternational: false, // currently no international phone number support
      phoneNumber: cleanData.phoneNumber,
      phoneType: PHONE_TYPE[fieldName],
    },
    e => !!e,
  );
};
