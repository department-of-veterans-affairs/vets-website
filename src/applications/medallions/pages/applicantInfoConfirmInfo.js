import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import ApplicantInfoNoteDescription from '../components/ApplicantInfoNoteDescription';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Confirm the personal information we have on file for you'),
    'view:applicantInfoNoteDescription': {
      'ui:description': props => <ApplicantInfoNoteDescription {...props} />,
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
