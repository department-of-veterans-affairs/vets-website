import merge from 'lodash/merge';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { veteranInformation } from '../../../utilities';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      ...veteranInformation.properties.veteranInformation,
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    fullName: {
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
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
    },
    ssn: {
      ...ssnUI,
      ...{
        'ui:title': 'Your Social Security number',
        'ui:required': () => true,
      },
    },
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
    birthDate: merge(currentOrPastDateUI('Your date of birth'), {
      'ui:required': () => true,
    }),
  },
};
