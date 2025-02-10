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
  inputNonVeteranClaimantPhone: phoneUI({
    required: true,
  }),
  inputNonVeteranClaimantEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['inputNonVeteranClaimantPhone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    inputNonVeteranClaimantPhone: phoneSchema,
    inputNonVeteranClaimantEmail: {
      ...emailSchema,
      type: 'string',
      maxLength: 31,
    },
  },
};
