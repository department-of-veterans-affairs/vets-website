import { ContactInfoDescription } from '../../utils/helpers';

import { contactInfoValidation } from '../../validation';

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': ContactInfoDescription,
  'ui:required': () => true, // don't allow progressing without all contact info
  'ui:validations': [contactInfoValidation], // needed to block form progression
  'ui:options': {
    hideOnReview: true, // We're using the `ReveiwDescription`, so don't show this page
    forceDivWrapper: true, // It's all info and links, so we don't need a fieldset or legend
  },
};

export const schema = {
  type: 'object',
  properties: {}, // no form elements on this page
};
