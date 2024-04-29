import React from 'react';
import {
  radioUI,
  radioSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { STATEMENT_TYPES, STATEMENT_TYPE_LABELS } from '../config/constants';

/** @type {PageSchema} */
export const statementTypePage = {
  uiSchema: {
    statementType: radioUI({
      title: 'What kind of statement do you want to submit?',
      description:
        'We want to make sure this is the right form for you. Before you continue with VA Form 21-4138, select one statement that best describes the action you want to take.',
      labels: STATEMENT_TYPE_LABELS,
      tile: true,
      errorMessages: {
        required: "Select the kind of statement you'd like to submit",
      },
      labelHeaderLevel: '1',
    }),
    'view:additionalInfoStatementType': {
      'ui:description': (
        <>
          If you’d like to use VA Form 21-4138 for your statement without
          selecting an answer here, you can{' '}
          <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
            go to VA Form 21-4138 now.
          </a>
        </>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      statementType: radioSchema(Object.values(STATEMENT_TYPES)),
      'view:additionalInfoStatementType': {
        type: 'object',
        properties: {},
      },
    },
    required: ['statementType'],
  },
};
