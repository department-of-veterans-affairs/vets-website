import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryOfficialExemptInfo from '../components/primaryOfficialExemptInfo';
import PrimaryOfficialTrainingInfo from '../components/primaryOfficialTrainingInfo';

const uiSchema = {
  primaryOfficialTraining: {
    'ui:description': PrimaryOfficialTrainingInfo,
    trainingDate: {
      ...currentOrPastDateUI({
        title:
          'Enter the date the required annual Section 305 training was completed.',
        hint: 'If exempt, see information below',
        errorMessages: {
          required: 'Please select a date',
        },
      }),
    },
    trainingExempt: {
      'ui:field': PrimaryOfficialExemptInfo,
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.primaryOfficialTraining?.trainingExempt) {
          return {
            ...formSchema,
            required: [],
          };
        }

        return {
          ...formSchema,
          required: ['trainingDate'],
        };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    primaryOfficialTraining: {
      type: 'object',
      properties: {
        trainingDate: currentOrPastDateSchema,
        trainingExempt: {
          type: 'boolean',
        },
      },
      required: ['trainingDate'],
    },
  },
};

export { uiSchema, schema };
