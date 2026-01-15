import React from 'react';
import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  checkboxUI,
  checkboxSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderOptions } from './config';

export const information = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a child',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    'view:childNameTitle': {
      'ui:description': <h4>Child’s name</h4>,
    },
    fullName: fullNameNoSuffixUI(title => `Child’s ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Child’s date of birth',
      labelHeaderLevel: '4',
      dataDogHidden: true,
      required: () => true,
    }),
    'view:childIdTitle': {
      'ui:description': <h4>Child’s identification information</h4>,
    },
    noSsn: checkboxUI({
      title: 'Child doesn’t have a Social Security number',
      required: () => false,
      hideIf: formData => !formData?.vaDependentsNoSsn, // check feature flag
    }),
    noSsnReason: radioUI({
      title: 'Why doesn’t your child have a Social Security number?',
      labels: {
        NONRESIDENT_ALIEN: 'Nonresident alien',
        NONE_ASSIGNED: 'No SSN has been assigned or requested',
      },
      required: (_chapterData, index, formData) =>
        formData?.childrenToAdd[index]?.noSsn === true,
      hideIf: (formData, index) =>
        formData?.childrenToAdd[index]?.noSsn !== true,
      errorMessages: {
        required: 'Tell us why the child doesn’t have a Social Security number',
      },
    }),
    ssn: {
      ...ssnUI('Child’s Social Security number'),
      'ui:required': (_chapterData, index, formData) =>
        !formData?.childrenToAdd[index]?.noSsn,
      'ui:options': {
        hideIf: (formData, index) => formData?.childrenToAdd[index]?.noSsn,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['fullName', 'birthDate'],
    properties: {
      'view:childNameTitle': { type: 'object', properties: {} },
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
      'view:childIdTitle': { type: 'object', properties: {} },
      noSsn: checkboxSchema,
      noSsnReason: radioSchema(['NONRESIDENT_ALIEN', 'NONE_ASSIGNED']),
      ssn: ssnSchema,
    },
  },
};
