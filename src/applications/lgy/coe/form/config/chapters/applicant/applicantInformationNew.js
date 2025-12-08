import React from 'react';

import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { personalInformation } from '../../schemaImports';

const description = () => (
  <>
    <p>
      New component!
    </p>
  </>
);

export const schema = personalInformation;

export const uiSchema = {
  'ui:description': description,
  fullName: fullNameUI,
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
