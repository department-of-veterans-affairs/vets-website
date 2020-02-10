import {
  genericTextinput,
  genericNumberInput,
  genericDateInput,
} from '../../../generic-schema';
import { suffixes } from '../../../constants';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

export const schema = {
  type: 'object',
  required: ['first', 'last', 'ssn', 'birthDate'],
  properties: {
    first: genericTextinput,
    middle: genericTextinput,
    last: genericTextinput,
    suffix: {
      type: 'string',
      enum: suffixes,
    },
    ssn: genericNumberInput,
    vaFileNumber: genericNumberInput,
    serviceNumber: genericNumberInput,
    birthDate: genericDateInput,
  },
};

export const uiSchema = {
  first: {
    'ui:title': 'Your first Name',
  },
  middle: {
    'ui:title': 'Your middle Name',
  },
  last: {
    'ui:title': 'Your last Name',
  },
  suffix: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  ssn: ssnUI,
  vaFileNumber: {
    'ui:title': 'Your VA file number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  serviceNumber: {
    'ui:title': 'Your Service number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
  },
  birthDate: currentOrPastDateUI('Your date of birth'),
};
