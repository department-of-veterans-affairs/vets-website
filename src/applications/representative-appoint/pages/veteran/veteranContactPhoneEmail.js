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
    required: formData => preparerIsVeteran({ formData }),
  }),
  veteranEmail: emailUI(),
};

export const schema = {
  type: 'object',
  required: [], // Remove 'Primary phone' from here since we're handling it conditionally
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    'Primary phone': phoneSchema,
    veteranEmail: emailSchema,
  },
};
