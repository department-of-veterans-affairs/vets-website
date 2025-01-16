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
  ...titleUI(() => 'Veteran’s phone number and email address'),
  profileNotUpdatedNote: {
    'ui:description': () => <ProfileNotUpdatedNote includePhone />,
  },
  primaryPhone: phoneUI({}),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: [],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    primaryPhone: phoneSchema,
    veteranEmail: emailSchema,
  },
};
