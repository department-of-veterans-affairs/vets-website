import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const {
  dateOfMarriage,
  spouseDateOfBirth,
  spouseFullName,
} = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s information',
    'ui:description':
      'Please fill this out to the best of your knowledge. The more accurate your responses, the faster we can process your application.',
    spouseFullName: {
      ...fullNameUI,
      first: {
        ...fullNameUI.first,
        'ui:title': 'Spouse\u2019s first name',
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      middle: {
        ...fullNameUI.middle,
        'ui:title': 'Spouse\u2019s middle name',
      },
      last: {
        ...fullNameUI.last,
        'ui:title': 'Spouse\u2019s last name',
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
      suffix: {
        ...fullNameUI.suffix,
        'ui:title': 'Spouse\u2019s suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
        },
      },
    },
    spouseDateOfBirth: currentOrPastDateUI('Spouse\u2019s date of birth'),
    dateOfMarriage: currentOrPastDateUI('Date of marriage'),
  },
  schema: {
    type: 'object',
    required: ['spouseDateOfBirth', 'dateOfMarriage'],
    properties: {
      spouseFullName,
      spouseDateOfBirth,
      dateOfMarriage,
    },
  },
};
