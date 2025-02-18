import { applicantInfoNoteDescription } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:applicantInfoNoteDescription': {
      'ui:description': applicantInfoNoteDescription,
    },
    'ui:options': {
      keepInPageOnReview: true,
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
