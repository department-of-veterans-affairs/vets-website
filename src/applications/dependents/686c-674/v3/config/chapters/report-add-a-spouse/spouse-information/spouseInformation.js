import React from 'react';
import {
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
  dateOfBirthUI,
  dateOfBirthSchema,
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CancelButton, certificateNotice } from '../../../helpers';
import { getFullName, getFormatedDate } from '../../../../../../shared/utils';

export const schema = {
  type: 'object',
  properties: {
    spouseInformation: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
        birthDate: dateOfBirthSchema,
        ssn: ssnSchema,
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
    ...titleUI('Your spouse’s personal information'),
    fullName: fullNameNoSuffixUI(title => `Spouse’s ${title}`),
    birthDate: dateOfBirthUI({
      title: 'Spouse’s date of birth',
      dataDogHidden: true,
      required: () => true,
    }),
    ssn: {
      ...ssnUI('Spouse’s Social Security number'),
      'ui:required': () => true,
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
  primaryButtonText: 'Don’t add this dependent',
  secondaryButtonText: 'Add this dependent',
  content: currentSpouse => (
    <>
      Our records show <strong>{getFullName(currentSpouse.fullName)}</strong> is
      already listed on your benefits with{' '}
      <strong>{getFormatedDate(currentSpouse.dateOfBirth)}</strong> as a date of
      birth.
      <p>
        If you don’t have another dependent with the same date of birth, we’ll
        take you back to Step 1 to update your selection.
      </p>
      <p>
        If you need to add another dependent with the same date of birth, you
        can continue adding this dependent.
      </p>
    </>
  ),
};
