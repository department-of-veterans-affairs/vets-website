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
// import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(() => 'Your phone number and email address'),
  profileNotUpdatedNote: {
    'ui:description': () => <ProfileNotUpdatedNote includePhone />,
  },
  inputVeteranPrimaryPhone: phoneUI({
    required: true,
  }),
  inputVeteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['inputVeteranPrimaryPhone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    inputVeteranPrimaryPhone: phoneSchema,
    inputVeteranEmail: {
      ...emailSchema,
      type: 'string',
      maxLength: 61,
    },
  },
};
