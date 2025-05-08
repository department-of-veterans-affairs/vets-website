import React from 'react';
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { CancelButton, certificateNotice } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
      },
    },
    'view:certificateNotice': {
      type: 'object',
      properties: {},
    },
    'view:cancelAddSpouse': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  spouseInformation: {
    ...titleUI('Spouse’s current legal name'),
    fullName: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
  },
  'view:certificateNotice': {
    'ui:description': certificateNotice,
    'ui:options': {
      hideIf: formData =>
        formData?.veteranContactInformation?.veteranAddress?.country === 'USA',
    },
  },
  'view:cancelAddSpouse': {
    'ui:description': (
      <CancelButton dependentType="spouse" isAddChapter altMessage />
    ),
  },
};
