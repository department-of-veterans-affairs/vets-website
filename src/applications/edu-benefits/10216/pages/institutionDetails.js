import {
  textUI,
  currentOrPastDateUI,
  textSchema,
  currentOrPastDateSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const institutionDetails = () => ({
  uiSchema: {
    institutionDetails: {
      ...titleUI('Institution details'),
      institutionName: {
        ...textUI({
          title: 'Institution name',
          errorMessages: {
            required: 'Please enter the name of your institution',
          },
        }),
      },
      facilityCode: {
        ...textUI({
          title: 'Facility code',
          hint: '',
          errorMessages: {
            required: 'Please enter your facility code',
          },
        }),
        'ui:options': {
          showFieldLabel: true,
          keepInPageOnReview: true,
        },
        'ui:validations': [
          (errors, fieldData) => {
            if (fieldData && !/^[a-zA-Z0-9]{8}$/.test(fieldData)) {
              errors.addError('Please enter a valid 8-digit facility code');
            }
          },
        ],
      },
      termStartDate: {
        ...currentOrPastDateUI({
          title: 'Term start date',
          errorMessages: {
            required: 'Please enter a start date',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      institutionDetails: {
        type: 'object',
        required: ['institutionName', 'facilityCode', 'termStartDate'],
        properties: {
          institutionName: textSchema,
          facilityCode: textSchema,
          termStartDate: currentOrPastDateSchema,
        },
      },
    },
  },
});

export default institutionDetails;
