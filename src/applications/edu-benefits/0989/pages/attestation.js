import React from 'react';
// @ts-check
import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  titleUI,
  textUI,
  textSchema,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateNameMatchesUser } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Attestation of Hours Transferred'),
    ...descriptionUI(
      <div>
        <p>By signing here I acknowledge the following,</p>
        <ul>
          <li>
            I have transferred fewer than 12 credits (or its equivalent in clock
            hours) from my program at the closed/disapproved facility;{' '}
            <strong>and</strong>
          </li>
          <li>
            If I am transferred 12 or more credits from such program at a later
            date, the Secretary will rescind/revoke my restored entitlement
          </li>
        </ul>
      </div>,
    ),
    attestationName: {
      ...textUI({
        title: 'Your full name',
        errorMessages: {
          required: 'You must enter your full name',
        },
        validations: [validateNameMatchesUser],
      }),
    },
    attestationDate: {
      ...currentOrPastDateUI({
        title: 'Date',
        required: () => true,
        monthSelect: false,
      }),
      'ui:errorMessages': {
        required: 'You must enter a date',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      attestationName: textSchema,
      attestationDate: currentOrPastDateSchema,
    },
    required: ['attestationName', 'attestationDate'],
  },
};
