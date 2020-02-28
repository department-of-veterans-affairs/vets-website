import { genericSchemas } from '../../../generic-schema';
import { suffixes } from '../../../constants';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import _ from 'lodash/fp';

export const schema = {
  type: 'object',
  required: ['first', 'last', 'ssn', 'birthDate'],
  properties: {
    first: genericSchemas.genericTextInput,
    middle: genericSchemas.genericTextInput,
    last: genericSchemas.genericTextInput,
    suffix: {
      type: 'string',
      enum: suffixes,
    },
    ssn: genericSchemas.genericNumberAndDashInput,
    vaFileNumber: genericSchemas.genericNumberAndDashInput,
    serviceNumber: genericSchemas.genericNumberAndDashInput,
    birthDate: genericSchemas.date,
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
  ssn: _.merge(_.unset('ui:title', ssnUI), {
    'ui:title': 'Your Social Security number',
  }),
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
