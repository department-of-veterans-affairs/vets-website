import {
  unemployabilityTitle,
  introDescription,
} from '../content/unemployabilityFormIntro';

export const uiSchema = index => ({
  'ui:title': unemployabilityTitle,
  'ui:description': introDescription,
  [`view:unemployabilityUploadChoice${index}`]: {
    'ui:title': 'Would you like to tell us about another event?',
    'ui:widget': 'yesNo',
  },
});

export const schema = index => ({
  type: 'object',
  required: [`view:unemployabilityUploadChoice${index}`],
  properties: {
    [`view:unemployabilityUploadChoice${index}`]: {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
  },
});
