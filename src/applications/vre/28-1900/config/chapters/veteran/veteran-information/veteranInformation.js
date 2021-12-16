import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const { veteranInformation } = fullSchema.properties;

export const schema = {
  type: 'object',
  properties: {
    veteranInformation,
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    fullName: {
      first: {
        'ui:title': 'Your first name',
        'ui:required': () => true,
      },
      middle: {
        'ui:title': 'Your middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      last: {
        'ui:title': 'Your last name',
        'ui:required': () => true,
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'form-select-medium',
          hideEmptyValueInReview: true,
        },
      },
    },
    dob: {
      ...currentOrPastDateUI('Date of birth'),
      'ui:required': () => true,
    },
  },
};
