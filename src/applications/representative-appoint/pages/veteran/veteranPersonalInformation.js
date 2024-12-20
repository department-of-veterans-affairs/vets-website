import React from 'react';
import { cloneDeep } from 'lodash';

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { preparerIsVeteran } from '../../utilities/helpers';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

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
  veteranFullName: fullNameMiddleInitialUI,
  veteranDateOfBirth: dateOfBirthUI(),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    veteranFullName: fullNameSchema,
    veteranDateOfBirth: dateOfBirthSchema,
  },
  required: ['veteranDateOfBirth'],
};
