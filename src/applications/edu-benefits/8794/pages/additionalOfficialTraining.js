import React from 'react';
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
        errorMessages: {
          required: 'Please select a date',
        },
      }),
      'ui:options': {
        hint: 'If exempt, see information below',
        hideIf: (formData, index) => {
          if (formData['additional-certifying-official']) {
            return formData['additional-certifying-official'][index]
              ?.additionalOfficialTraining?.trainingExempt;
          }
          return formData?.additionalOfficialTraining?.trainingExempt;
        },
      },
    },
    'view:trainingExemptLabel': {
      'ui:description': (
        <p className="vads-u-margin-top--4">
          <strong>This individual is exempt</strong>
        </p>
      ),
      'ui:options': {
        hideIf: (formData, index) => {
          if (formData['additional-certifying-official']) {
            return !formData['additional-certifying-official'][index]
              ?.additionalOfficialTraining?.trainingExempt;
          }
          return !formData?.additionalOfficialTraining?.trainingExempt;
        },
      },
    },
    trainingExempt: {
      'ui:field': AdditionalOfficialExemptInfo,
    },
    'ui:options': {
      updateSchema: (formData, formSchema, ui, index) => {
        const isAdding = !!formData['additional-certifying-official'];

        if (isAdding) {
          const addingTraining =
            formData['additional-certifying-official'][index]
              .additionalOfficialTraining;
          if (addingTraining?.trainingExempt) {
            return {
              ...formSchema,
              required: [],
            };
          }
          return {
            ...formSchema,
            required: ['trainingCompletionDate'],
          };
        }

        const editingTraining = formData.additionalOfficialTraining;
        if (editingTraining?.trainingExempt) {
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
        'view:trainingExemptLabel': {
          type: 'object',
          properties: {},
        },
        trainingExempt: {
          type: 'boolean',
        },
      },
      required: ['trainingCompletionDate'],
    },
  },
};

export { uiSchema, schema };
