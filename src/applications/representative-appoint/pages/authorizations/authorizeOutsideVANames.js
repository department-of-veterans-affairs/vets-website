import React from 'react';
import {
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import OutsideVAAuthorizationUnsureNote from '../../components/OutsideVAAuthorizationUnsureNote';
import { OutsideVAAuthorizationNameDescription } from '../../components/OutsideVAAuthorizationNameDescription';

export const uiSchema = {
  'ui:description': ({ formData }) => (
    <OutsideVAAuthorizationNameDescription formData={formData} />
  ),
  inputAuthorizationsTeamMembers: {
    ...textUI({
      title: `Enter the name of each team member who can access your records
    outside of VA’s information technology systems`,
      hint: 'Use commas to separate names',
    }),
  },
  'view:unsureNote': {
    'ui:description': <OutsideVAAuthorizationUnsureNote />,
  },
};

export const schema = {
  type: 'object',
  required: ['inputAuthorizationsTeamMembers'],
  properties: {
    inputAuthorizationsTeamMembers: textSchema,
    'view:unsureNote': {
      type: 'object',
      properties: {},
    },
  },
};
