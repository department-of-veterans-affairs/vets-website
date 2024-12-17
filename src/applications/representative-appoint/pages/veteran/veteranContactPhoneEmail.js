import React from 'react';

import {
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } name and date of birth`,
  ),
  profileNotUpdatedNote: {
    'ui:description': formData => (
      <ProfileNotUpdatedNote formData={formData} includePhone />
    ),
  },
  'Primary phone': phoneUI({
    required: true,
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: ['Primary phone'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
