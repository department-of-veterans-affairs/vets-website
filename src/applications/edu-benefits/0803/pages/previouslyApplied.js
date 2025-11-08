// @ts-check
import React from 'react';
import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const Options = {
  yes: 'Yes',
  no: 'No',
};

function applicationWarning() {
  return (
    <va-alert status="warning">
      <h2 slot="headline">
        You will need to apply for VA education benefits before we can process
        your application for reimbursement
      </h2>
      <p>
        Based on your answer, you might not qualify for reimbursement right now.
        You’ll need to apply for at least one of these VA education benefits and
        be found eligible in order for your reimbursement to be processed.
      </p>
      <ul>
        <li>
          <a href="/">Chapter 33: VA Form 22-1990</a> <strong> or,</strong>
        </li>
        <li>
          <a href="/">Chapter 33: VA Form 22-5490</a>
        </li>
      </ul>
    </va-alert>
  );
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your VA education benefits'),
    hasPreviouslyApplied: {
      ...radioUI({
        title: 'Have you previously applied for VA education benefits?',
        required: () => true,
        labels: Options,
      }),
    },
    'view:applicationWarning': {
      'ui:description': applicationWarning,
      'ui:options': {
        hideIf: form => form.hasPreviouslyApplied !== 'no',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasPreviouslyApplied: radioSchema(Object.keys(Options)),
      'view:applicationWarning': { type: 'object', properties: {} },
    },
    required: ['hasPreviouslyApplied'],
  },
};
