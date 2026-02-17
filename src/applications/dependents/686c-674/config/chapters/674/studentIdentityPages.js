import React from 'react';
import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  checkboxUI,
  checkboxSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { relationshipToStudentLabels } from './helpers';
import { addStudentsOptions } from './addStudentsSetup';

/** @returns {PageSchema} */
export const studentInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a student',
      nounSingular: addStudentsOptions.nounSingular,
    }),
    'view:studentNameTitle': {
      'ui:description': <h4>Student’s name</h4>,
    },
    fullName: fullNameNoSuffixUI(title => `Student's ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Student\u2019s date of birth',
      labelHeaderLevel: '4',
      dataDogHidden: true,
      required: () => true,
    }),
    'view:studentIdTitle': {
      'ui:description': <h4>Student’s identification information</h4>,
    },
    noSsn: {
      ...checkboxUI({
        title: 'Student doesn\u2019t have a Social Security number',
        required: () => false,
      }),
      'ui:options': {
        hideIf: (_formData, _index, fullData) => !fullData?.vaDependentsNoSsn, // check feature flag
      },
    },
    noSsnReason: radioUI({
      title: 'Why doesn\u2019t your child have a Social Security number?',
      labels: {
        NONRESIDENT_ALIEN: 'Nonresident alien',
        NONE_ASSIGNED: 'No SSN has been assigned or requested',
      },
      required: (_chapterData, index, formData) =>
        formData?.studentInformation?.[index]?.noSsn === true,
      hideIf: (formData, index) => {
        const addMode = formData?.studentInformation?.[index]?.noSsn;
        const editMode = formData?.noSsn;
        return !(addMode || editMode);
      },
      errorMessages: {
        required:
          'Tell us why the child doesn\u2019t have a Social Security number',
      },
    }),
    ssn: {
      ...ssnUI('Child\u2019s Social Security number'),
      'ui:required': (_chapterData, index, formData) =>
        !formData?.studentInformation?.[index]?.noSsn,
      'ui:options': {
        hideIf: (formData, index) => {
          const addMode = formData?.studentInformation?.[index]?.noSsn;
          const editMode = formData?.noSsn;
          return addMode || editMode;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['fullName', 'birthDate'],
    properties: {
      'view:studentNameTitle': { type: 'object', properties: {} },
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
      'view:studentIdTitle': { type: 'object', properties: {} },
      noSsn: checkboxSchema,
      noSsnReason: radioSchema(['NONRESIDENT_ALIEN', 'NONE_ASSIGNED']),
      ssn: ssnSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentRelationshipPage = {
  uiSchema: {
    relationshipToStudent: radioUI({
      title: 'What\u2019s your relationship to this child?',
      labels: relationshipToStudentLabels,
      labelHeaderLevel: 3,
    }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToStudent'],
    properties: {
      relationshipToStudent: radioSchema(
        Object.keys(relationshipToStudentLabels),
      ),
    },
  },
};
