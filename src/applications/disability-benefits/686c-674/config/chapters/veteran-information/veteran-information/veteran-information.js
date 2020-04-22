import { genericSchemas } from '../../../generic-schema';
import { suffixes } from '../../../constants';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import _ from 'lodash/fp';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      type: 'object',
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
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    first: {
      'ui:title': 'Your first name',
      'ui:required': () => true,
    },
    middle: {
      'ui:title': 'Your middle name',
    },
    last: {
      'ui:title': 'Your last name',
      'ui:required': () => true,
    },
    suffix: {
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    ssn: _.merge(_.unset('ui:title', ssnUI), {
      'ui:title': 'Your Social Security number',
      'ui:required': () => true,
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
      'ui:title': 'Your service number',
      'ui:errorMessages': {
        pattern: 'Please enter only numbers',
      },
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    birthDate: _.merge(currentOrPastDateUI('Your date of birth'), {
      'ui:required': () => true,
    }),
  },
};
