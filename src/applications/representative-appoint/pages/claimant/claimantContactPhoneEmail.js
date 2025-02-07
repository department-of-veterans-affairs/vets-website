import React from 'react';

import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

export const uiSchema = {
  ...titleUI('Your phone number and email address'),
  profileNotUpdatedNote: {
    'ui:description': () => (
      <ProfileNotUpdatedNote includePhone isClaimantChapter />
    ),
  },
  applicantPhone: phoneUI({
    required: true,
  }),
  applicantEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['applicantPhone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    applicantPhone: phoneSchema,
    applicantEmail: {
      ...emailSchema,
      type: 'string',
      maxLength: 31,
    },
  },
};
