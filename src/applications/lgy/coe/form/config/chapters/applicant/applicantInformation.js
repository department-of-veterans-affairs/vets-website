import React from 'react';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import fullNameUI from 'platform/forms/definitions/fullName';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const description = () => (
  <>
    <p>
      This is the personal information we have on file for you. If you notice
      any errors, please correct them now. Any updates you make will change the
      information on this request only.
    </p>
    <p>
      <strong>Note:</strong> If you need to update your personal information
      with VA, you can call us at <Telephone contact={'800-827-1000'} />. We’re
      here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET
    </p>
  </>
);

export const schema = {
  type: 'object',
  properties: {
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
        suffix: {
          type: 'string',
          enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
        },
      },
      required: ['first', 'last'],
    },
    dateOfBirth: {
      type: 'string',
      title: 'Date of birth',
      pattern:
        '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
    },
  },
  required: ['dateOfBirth'],
};

export const uiSchema = {
  'ui:description': description,
  fullName: fullNameUI,
  dateOfBirth: currentOrPastDateUI('Date of birth'),
};
