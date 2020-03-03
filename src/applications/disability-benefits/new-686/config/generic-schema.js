import {
  datePattern,
  numberAndDashPattern,
  states50AndDC,
  suffixes,
  textOnlyPattern,
  countries,
  phonePattern,
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
  },
  genericNumberInput: {
    type: 'string',
    maxLength: 50,
    pattern: numberAndDashPattern,
  },
  genericUSAStateDropdown: {
    type: 'string',
    enum: states50AndDC.map(state => state.value),
    default: states50AndDC.map(state => state.label),
  },
  countryDropdown: {
    type: 'string',
    enum: countries.map(country => country.label),
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
      suffix: {
        type: 'string',
        enum: suffixes,
      },
    },
    required: ['first', 'last'],
  },
  date: {
    type: 'string',
    pattern: datePattern,
  },
  emailInput: {
    type: 'string',
    format: 'email',
  },
  phoneInput: {
    type: 'string',
    pattern: phonePattern,
  },
};
