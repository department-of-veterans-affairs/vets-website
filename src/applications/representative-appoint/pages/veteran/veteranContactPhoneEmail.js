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
import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(() => 'Your phone number and email address'),
  profileNotUpdatedNote: {
    'ui:description': formData => (
      <ProfileNotUpdatedNote
        includePhone
        preparerIsVeteran={preparerIsVeteran({ formData })}
      />
    ),
  },
  primaryPhone: phoneUI({
    required: true,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['primaryPhone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    primaryPhone: phoneSchema,
    veteranEmail: emailSchema,
  },
};
