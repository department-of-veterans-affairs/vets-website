import React from 'react';
import {
  checkboxUI,
  checkboxSchema,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  radioUI,
  radioSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CancelButton, certificateNotice } from '../../../helpers';
import { getFullName, getFormatedDate } from '../../../../../shared/utils';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        'view:spouseNameTitle': { type: 'object', properties: {} },
        fullName: fullNameNoSuffixSchema,
        birthDate: dateOfBirthSchema,
        'view:spouseIdTitle': { type: 'object', properties: {} },
        noSsn: checkboxSchema,
        noSsnReason: radioSchema(['NONRESIDENT_ALIEN', 'NONE_ASSIGNED']),
        ssn: ssnSchema,
      },
    },
    'view:certificateNotice': { type: 'object', properties: {} },
    'view:cancelAddSpouse': { type: 'object', properties: {} },
  },
};

export const uiSchema = {
  spouseInformation: {
    ...titleUI('Your spouse’s personal information'),
    'view:spouseNameTitle': {
      'ui:description': <h4>Spouse’s name</h4>,
    },
    fullName: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
    birthDate: dateOfBirthUI({
      title: 'Spouse’s date of birth',
      labelHeaderLevel: '4',
      dataDogHidden: true,
      required: () => true,
    }),
    'view:spouseIdTitle': {
      'ui:description': <h4>Spouse’s identification information</h4>,
    },
    noSsn: checkboxUI({
      title: 'Spouse doesn’t have a Social Security number',
      required: () => false,
      hideIf: formData => !formData?.vaDependentsNoSsn, // check feature flag
    }),
    noSsnReason: radioUI({
      title: 'Why doesn’t your spouse have a Social Security number?',
      labels: {
        NONRESIDENT_ALIEN: 'Nonresident alien',
        NONE_ASSIGNED: 'No SSN has been assigned or requested',
      },
      required: (_chapterData, _index, formData) =>
        formData?.spouseInformation?.noSsn === true,
      hideIf: formData => formData?.spouseInformation?.noSsn !== true,
      errorMessages: {
        required:
          'Tell us why the spouse doesn’t have a Social Security number',
      },
    }),
    ssn: {
      ...ssnUI('Spouse’s Social Security number'),
      'ui:required': (_chapterData, _index, formData) =>
        formData?.spouseInformation?.noSsn !== true,
      'ui:options': {
        hideIf: formData => formData?.spouseInformation?.noSsn === true,
      },
    },
  },
  'view:certificateNotice': {
    'ui:description': certificateNotice,
    'ui:options': {
      hideIf: formData =>
        formData?.veteranContactInformation?.veteranAddress?.country === 'USA',
    },
  },
  'view:cancelAddSpouse': {
    'ui:description': <CancelButton dependentType="spouse" isAddChapter />,
  },
};

export const modalContent = {
  title: 'You already have a dependent with this date of birth',
  primaryButtonText: 'Cancel adding',
  secondaryButtonText: 'Continue',
  content: currentSpouse => (
    <>
      Our records show a dependent with a date of birth{' '}
      <strong>{getFormatedDate(currentSpouse.dateOfBirth)}</strong> already
      listed on your benefits as{' '}
      <strong>{getFullName(currentSpouse.fullName)}</strong>.
      <p>
        If you’re adding a different dependent with the same date of birth,
        continue.
      </p>
      <p>
        Otherwise, cancel adding and we’ll take you back to Step 1 to update
        your selection.
      </p>
    </>
  ),
};
