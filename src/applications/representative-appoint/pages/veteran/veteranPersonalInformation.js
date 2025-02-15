import React from 'react';
import { cloneDeep } from 'lodash';

import {
  dateOfBirthUI,
  dateOfBirthSchema,
  fullNameUI,
  titleUI,
  titleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';
import { preparerIsVeteran } from '../../utilities/helpers';

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
    'ui:description': () => <ProfileNotUpdatedNote includePhone />,
  },
  inputVeteranFullName: fullNameMiddleInitialUI,
  inputVeteranDOB: dateOfBirthUI(),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    inputVeteranFullName: {
      type: 'object',
      required: ['first', 'last'],
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
    inputVeteranDOB: dateOfBirthSchema,
  },
  required: ['inputVeteranDOB', 'inputVeteranFullName'],
};
