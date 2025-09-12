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
import { getFullName, getFormatedDate } from '../../../../../shared/utils';

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
  title: 'Potential duplicate',
  primaryButtonText: 'Don’t add, it’s a duplicate',
  secondaryButtonText: 'Add, it’s a different person',
  content: currentSpouse => (
    <>
      We checked your VA records and found another dependent already listed on
      your benefits with the birth date of{' '}
      <strong>{getFormatedDate(currentSpouse.dateOfBirth)}</strong>:{' '}
      <strong>{getFullName(currentSpouse.fullName)}</strong>.
      <p>Are you adding a different person, or is this a duplicate?</p>
      <p>
        <strong>Note</strong>: If you don’t add this dependent, we’ll take you
        back to Step 1 to update your selection.
      </p>
    </>
  ),
};
