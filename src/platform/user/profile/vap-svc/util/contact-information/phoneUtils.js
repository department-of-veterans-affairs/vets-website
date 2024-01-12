import pickBy from 'lodash/pickBy';
import { PHONE_TYPE, USA } from '../../constants';

export const phoneFormSchema = {
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
    extension: {
      type: 'string',
      pattern: '^\\s*[0-9-]{0,6}\\s*$',
      maxLength: 6,
    },
  },
  required: ['inputPhoneNumber'],
};

const phoneErrorMessage = 'Enter a 10 digit phone number';
export const phoneUiSchema = fieldName => {
  return {
    inputPhoneNumber: {
      'ui:title': `${fieldName} (U.S. numbers only)`,
      'ui:validations': [
        (errors, field) => {
          // checks that the phone number is at least 10 numerical digits
          const strippedPhone = field?.replace(/[^0-9]/g, '');
          if (strippedPhone?.length !== 10) {
            errors.addError(phoneErrorMessage);
          }
        },
      ],
      'ui:errorMessages': {
        pattern: phoneErrorMessage,
      },
      'ui:options': {
        ariaDescribedby: 'error-message-details',
      },
    },
    extension: {
      'ui:title': 'Extension (6 digits maximum)',
      'ui:errorMessages': {
        pattern: 'Please enter a valid extension up to 6 digits.',
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
