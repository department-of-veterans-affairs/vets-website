import { PHONE_TYPE, USA } from '@@vap-svc/constants';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';
import pickBy from 'lodash/pickBy';

export const phoneFormSchema = {
  type: 'object',
  properties: {
    'view:noInternationalNumbers': {
      type: 'object',
      properties: {},
    },
    inputPhoneNumber: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    extension: {
      type: 'string',
      pattern: '^\\s*[a-zA-Z0-9]{0,6}\\s*$',
      maxLength: 6,
    },
  },
  required: ['inputPhoneNumber'],
};

export const phoneUiSchema = fieldName => {
  return {
    inputPhoneNumber: {
      'ui:widget': PhoneNumberWidget,
      'ui:title': `${fieldName} (U.S. numbers only)`,
      'ui:errorMessages': {
        pattern: 'Please enter a valid 10-digit U.S. phone number.',
      },
      'ui:options': {
        ariaDescribedby: 'error-message-details',
      },
    },
    extension: {
      'ui:title': 'Extension (6 digits maximum)',
      'ui:errorMessages': {
        pattern: 'Please enter a valid extension.',
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
