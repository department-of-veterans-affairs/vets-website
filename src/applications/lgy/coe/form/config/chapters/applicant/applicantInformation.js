import React from 'react';

import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { personalInformation } from '../../schemaImports';

const description = () => (
  <>
    <p>
      This is the personal information we have on file for you. If you notice
      any errors, correct them now. Any updates you make will change the
      information on this request only.
    </p>
    <p>
      <strong>Note:</strong> If you need to update your personal information
      with VA, you can call Veterans Benefits Assistance at{' '}
      <va-telephone contact="8008271000" />. We’re here Monday through Friday,
      between 8:00 a.m. and 9:00 p.m. ET
    </p>
  </>
);

export const schema = personalInformation;

export const uiSchema = {
  'ui:description': description,
  fullName: fullNameUI,
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
