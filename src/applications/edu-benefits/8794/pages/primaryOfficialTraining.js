import React from 'react';
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryOfficialExemptInfo from '../components/PrimaryOfficialExemptInfo';
import PrimaryOfficialTrainingInfo from '../components/PrimaryOfficialTrainingInfo';
import TrainingExemptCustomReviewField from '../components/TrainingExemptCustomReviewField';

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
      'ui:options': {
        hint: 'If exempt, see information below',
        hideIf: (formData, index) => {
          if (formData['additional-certifying-official']) {
            return formData['additional-certifying-official'][index]
              ?.primaryOfficialTraining?.trainingExempt;
          }
          return formData?.primaryOfficialTraining?.trainingExempt;
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
              ?.primaryOfficialTraining?.trainingExempt;
          }
          return !formData?.primaryOfficialTraining?.trainingExempt;
        },
      },
    },
    trainingExempt: {
      'ui:field': PrimaryOfficialExemptInfo,
      'ui:reviewField': TrainingExemptCustomReviewField,
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
