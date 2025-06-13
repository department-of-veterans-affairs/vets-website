import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalOfficialExemptInfo from '../components/AdditionalOfficialExemptInfo';
import AdditionalOfficialTrainingInfo from '../components/AdditionalOfficialTrainingInfo';

const uiSchema = {
  additionalOfficialTraining: {
    'ui:description': AdditionalOfficialTrainingInfo,
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
      'ui:field': AdditionalOfficialExemptInfo,
    },
    // 'view:trainingExemptLabel': {
    //   'ui:description': <div><strong>This individual is exempt</strong></div>,
    //   'ui:options': {
    //    hideIf: formData => !formData?.trainingExempt,
    //   },
    // },
    'ui:options': {
      updateSchema: (formData, formSchema, ui, index) => {
        if (
          formData['additional-certifying-official'][index]
            ?.additionalOfficialTraining?.trainingExempt
        ) {
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
    additionalOfficialTraining: {
      type: 'object',
      properties: {
        trainingCompletionDate: currentOrPastDateSchema,
        trainingExempt: {
          type: 'boolean',
        },
        // 'view:trainingExemptLabel': {
        //   type: 'object',
        // },
      },
      required: ['trainingCompletionDate'],
    },
  },
};

export { uiSchema, schema };
