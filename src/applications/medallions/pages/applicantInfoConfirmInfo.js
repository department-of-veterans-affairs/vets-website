import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import { applicantInfoNoteDescription } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Confirm the personal information we have on file for you'),
    'view:applicantInfoNoteDescription': {
      'ui:description': applicantInfoNoteDescription,
    },
    'ui:options': {
      keepInPageOnReview: false,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:applicantInfoNoteDescription': {
        type: 'object',
        properties: {},
      },
    },
  },
};
