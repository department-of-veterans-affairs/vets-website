import recordEvent from 'platform/monitoring/record-event';

// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const getItemSchema = (schema, index) => {
  const itemSchema = schema;
  if (itemSchema.items.length > index) {
    return itemSchema.items[index];
  }
  return itemSchema.additionalItems;
};

/**
 * Return a phone number object
 * @param {String} phone - phone number string to convert to an object
 * @return {phoneObject}
 */
export const returnPhoneObject = phone => {
  const result = {
    countryCode: '',
    areaCode: '',
    phoneNumber: '',
    phoneNumberExt: '',
  };
  if (typeof phone === 'string' && phone?.length === 10) {
    result.countryCode = '1';
    result.areaCode = phone.slice(0, 3);
    result.phoneNumber = phone.slice(-7);
  }
  return result;
};

export const recordButtonClick = (type, label, color, record = recordEvent) => {
  record({
    event: 'cta-button-click',
    'button-type': type,
    'button-click-label': label,
    'button-background-color': color,
  });
};

export const recordModalVisible = (
  type,
  heading,
  key,
  reason,
  record = recordEvent,
) => {
  record({
    event: 'visible-alert-box',
    'alert-box-type': type,
    'alert-box-heading': heading,
    'error-key': key,
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': false,
    'reason-for-alert': reason,
  });
};

export const recordRadioChange = (
  title,
  label,
  required,
  record = recordEvent,
) => {
  record({
    event: 'int-radio-button-option-click',
    'radio-button-label': title,
    'radio-button-optionLabel': label,
    'radio-button-required': required,
  });
};
