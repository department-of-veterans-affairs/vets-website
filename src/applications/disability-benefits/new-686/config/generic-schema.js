import { states50AndDC } from './constants';

export const genericSchemas = {
  genericLocation: {
    type: 'object',
    required: ['city', 'state'],
    properties: {
      state: {
        type: 'string',
        maxLength: 30,
        pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
      },
      city: {
        type: 'string',
        maxLength: 30,
        pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
      },
    },
  },
  genericTextinput: {
    type: 'string',
    maxLength: 50,
    pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
  },
  genericUSACountryDropdown: {
    type: 'string',
    enum: states50AndDC.map(state => state.value),
    default: states50AndDC.map(state => state.label),
  },
};

export const genericTextinput = {
  type: 'string',
  maxLength: 50,
  pattern: '^(?!\\s)(?!.*?\\s{2,})[^<>%$#@!^&*0-9]+$',
};

export const genericNumberInput = {
  type: 'string',
  maxLength: 50,
  pattern: '^[0-9]{9}$',
};

export const genericDateInput = {
  pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
  type: 'string',
};
