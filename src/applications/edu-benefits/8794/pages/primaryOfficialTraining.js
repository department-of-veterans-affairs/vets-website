import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryOfficialExemptInfo from '../components/PrimaryOfficialExemptInfo';
import PrimaryOfficialTrainingInfo from '../components/PrimaryOfficialTrainingInfo';

const uiSchema = {
  primaryOfficialTraining: {
    'ui:description': PrimaryOfficialTrainingInfo,
    trainingCompletionDate: {
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
          required: ['trainingCompletionDate'],
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
        trainingCompletionDate: currentOrPastDateSchema,
        trainingExempt: {
          type: 'boolean',
        },
      },
      required: ['trainingCompletionDate'],
    },
  },
};

export { uiSchema, schema };
