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
    'ui:description': formData => (
      <ProfileNotUpdatedNote formData={formData} includePhone />
    ),
  },
  'Primary phone': phoneUI({
    required: false,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: [],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },

    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
