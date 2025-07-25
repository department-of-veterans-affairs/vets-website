import React from 'react';
import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CancelButton } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        birthDate: currentOrPastDateSchema,
        'view:cancelDivorce': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s information'),
    fullName: {
      ...fullNameNoSuffixUI(title => `Former spouse’s ${title}`),
    },
    birthDate: currentOrPastDateUI({
      title: 'Former spouse’s date of birth',
      dataDogHidden: true,
      required: () => true,
    }),
    'view:cancelDivorce': {
      'ui:description': (
        <CancelButton dependentType="divorced spouse" isAddChapter={false} />
      ),
    },
  },
};
