import {
  states50AndDC,
  textOnlyPattern,
  numberOnlyPattern,
  datePattern,
} from './constants';

export const genericSchemas = {
  genericLocation: {
    type: 'object',
    required: ['city', 'state'],
    properties: {
      state: {
        type: 'string',
        maxLength: 30,
        pattern: textOnlyPattern,
      },
      city: {
        type: 'string',
        maxLength: 30,
        pattern: textOnlyPattern,
      },
    },
  },
  genericTextinput: {
    type: 'string',
    maxLength: 50,
    pattern: textOnlyPattern,
  },
  genericNumberInput: {
    type: 'string',
    maxLength: 50,
    pattern: numberOnlyPattern,
  },
  genericUSACountryDropdown: {
    type: 'string',
    enum: states50AndDC.map(state => state.value),
    default: states50AndDC.map(state => state.label),
  },
  fullName: {
    type: 'object',
    properties: {
      first: {
        type: 'string',
        minLength: 1,
        maxLength: 30,
        pattern: textOnlyPattern,
      },
      middle: {
        type: 'string',
        maxLength: 20,
        pattern: textOnlyPattern,
      },
      last: {
        type: 'string',
        minLength: 1,
        maxLength: 30,
        pattern: textOnlyPattern,
      },
    },
    required: ['first', 'last'],
  },
  date: {
    type: 'string',
    pattern: datePattern,
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
