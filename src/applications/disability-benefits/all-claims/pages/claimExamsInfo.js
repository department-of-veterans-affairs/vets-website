import {
  claimExamsDescription,
  claimExamsFAQ,
} from '../content/claimExamsInfo';

export const uiSchema = {
  'ui:description': claimExamsDescription,
  'view:faqAccordion': {
    'ui:description': claimExamsFAQ,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:faqAccordion': {
      type: 'object',
      properties: {},
    },
  },
};
