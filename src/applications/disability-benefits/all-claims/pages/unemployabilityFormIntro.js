import {
  unemployabilityTitle,
  introDescription,
} from '../content/unemployabilityFormIntro';

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': introDescription,
  'view:unemployabilityUploadChoice': {
    'ui:title': 'Please tell us what you would like to do.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my unemployability.',
        upload:
          'I already filled out a paper VA Form 21-8940 and want to upload it.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:unemployabilityUploadChoice'],
  properties: {
    'view:unemployabilityUploadChoice': {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
  },
};
