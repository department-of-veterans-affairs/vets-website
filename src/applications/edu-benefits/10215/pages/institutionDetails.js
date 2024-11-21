import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const uiSchema = {
  institutionDetails: {
    'ui:title': 'Tell us about your institution',
    institutionName: {
      'ui:title': 'Institution name',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter an institution name',
      },
    },
    facilityCode: {
      'ui:title': 'Facility code',
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter a facility code',
      },
    },
    termStartDate: {
      'ui:title': 'Term start date',
      'ui:widget': 'date',
      'ui:errorMessages': {
        required: 'Please enter a term start date',
      },
    },
    dateOfCalculations: {
      'ui:title': 'Date of calculations',
      'ui:widget': 'date',
      'ui:errorMessages': {
        required: 'Please enter a date of calculations',
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      properties: {
        institutionName: {
          type: 'string',
        },
        facilityCode: {
          type: 'string',
        },
        termStartDate: {
          type: 'string',
        },
        dateOfCalculations: {
          type: 'string',
        },
      },
      required: [
        'institutionName',
        'facilityCode',
        'termStartDate',
        'dateOfCalculations',
      ],
    },
  },
};

export { uiSchema, schema };
