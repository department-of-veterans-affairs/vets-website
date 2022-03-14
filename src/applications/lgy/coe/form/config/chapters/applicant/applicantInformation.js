import React from 'react';

import { validateWhiteSpace } from 'platform/forms/validations';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { personalInformation } from '../../schemaImports';

const description = () => (
  <>
    <p>
      This is the personal information we have on file for you. If you notice
      any errors, please correct them now. Any updates you make will change the
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

const validateName = (errors, pageData) => {
  const { firstName, lastName } = pageData;
  validateWhiteSpace(errors.firstName, firstName);
  validateWhiteSpace(errors.lastName, lastName);
};

export const schema = personalInformation;

export const uiSchema = {
  'ui:description': description,
  fullName: {
    'ui:validations': [validateName],
    firstName: {
      'ui:title': 'Your first name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    middleName: {
      'ui:title': 'Your middle name',
    },
    lastName: {
      'ui:title': 'Your last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    suffixName: {
      'ui:title': 'Suffix',
      'ui:options': {
        widgetClassNames: 'form-select-medium',
      },
    },
  },
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
