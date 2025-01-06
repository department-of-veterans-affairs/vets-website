import React from 'react';

import {
  radioSchema,
  radioUI,
  titleUI,
  titleSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';
import { branchOptions } from '../../constants/options';
import { preparerIsVeteran } from '../../utilities/helpers';

export const uiSchema = {
  ...titleUI(
    ({ formData }) =>
      `${
        preparerIsVeteran({ formData }) ? 'Your' : 'Veteran’s'
      } service information`,
  ),
  profileNotUpdatedNote: {
    'ui:description': () => <ProfileNotUpdatedNote includePhone />,
  },
  'Branch of Service': radioUI('Branch of service'),
};

export const schema = {
  type: 'object',
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    'Branch of Service': radioSchema(branchOptions),
  },
  required: ['Branch of Service'],
};
