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
import ProfileNotUpdatedNote from '../../components/ProfileNotUpdatedNote';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const uiSchema = {
  ...titleUI('Your personal information'),
  profileNotUpdatedNote: {
    'ui:description': () => (
      <ProfileNotUpdatedNote includePhone isClaimantChapter />
    ),
  },
  applicantName: fullNameMiddleInitialUI,
  applicantDOB: dateOfBirthUI({
    required: () => true,
  }),
};

export const schema = {
  type: 'object',
  required: ['applicantDOB'],
  properties: {
    titleSchema,
    profileNotUpdatedNote: { type: 'object', properties: {} },
    applicantName: {
      ...fullNameSchema,
      properties: {
        ...fullNameSchema.properties,
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
    applicantDOB: dateOfBirthSchema,
  },
};
