import {
  textUI,
  currentOrPastDateUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    institutionName: {
      'ui:title': 'Institution name',
      'ui:component': textUI,
      'ui:required': () => true,

      'ui:errorMessages': {
        required: 'Please enter the name of your institution',
      },
    },
    facilityCode: {
      'ui:title': 'Facility code',
      'ui:component': textUI,
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your facility code',
      },
      'ui:options': {
        showFieldLabel: true,
        keepInPageOnReview: true,
      },
      'ui:validations': [
        (errors, fieldData) => {
          if (fieldData && fieldData.length !== 8) {
            errors.addError('Facility code must be exactly 8 characters long');
          }
        },
      ],
    },
    startDate: {
      ...currentOrPastDateUI('Term start date'),
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter a date',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['institutionName', 'facilityCode', 'startDate'],
    properties: {
      institutionName: {
        type: 'string',
      },
      facilityCode: {
        type: 'string',
      },
      startDate: {
        type: 'string',
      },
    },
  },
};
