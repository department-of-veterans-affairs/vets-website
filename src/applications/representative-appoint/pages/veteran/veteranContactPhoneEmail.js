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
  ...titleUI(() => 'Your phone number and email address'),
  profileNotUpdatedNote: {
    'ui:description': () => <ProfileNotUpdatedNote includePhone />,
  },
  primaryPhone: phoneUI({
    required: true,
  }),
  veteranEmail: emailUI({
    required: formData =>
      formData?.['view:isUserLOA3'] &&
      formData.representativeSubmissionMethod === 'digital',
  }),
};

export const schema = {
  type: 'object',
  required: ['primaryPhone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    primaryPhone: phoneSchema,
    veteranEmail: {
      ...emailSchema,
      type: 'string',
      maxLength: 61,
    },
  },
};
