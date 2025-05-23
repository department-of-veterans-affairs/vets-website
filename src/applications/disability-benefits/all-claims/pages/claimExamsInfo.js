import {
  claimExamsDescription,
  claimExamsFAQ,
} from '../content/claimExamsInfo';
import { standardTitle } from '../content/form0781';

export const uiSchema = {
  'ui:title': standardTitle('Next steps in your claim process'),
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
