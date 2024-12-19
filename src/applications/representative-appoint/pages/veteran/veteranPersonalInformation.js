import React from 'react';

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
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
  veteranFullName: fullNameUI(),
  veteranDateOfBirth: dateOfBirthUI(),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    veteranFullNameName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          maxLength: 12,
        },
        middle: {
          type: 'string',
          maxLength: 1,
        },
        last: {
          type: 'string',
          maxLength: 18,
        },
      },
    },
    veteranDateOfBirth: dateOfBirthSchema,
  },
  required: ['veteranDateOfBirth'],
};
