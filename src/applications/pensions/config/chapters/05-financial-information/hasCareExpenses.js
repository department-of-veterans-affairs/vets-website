import React from 'react';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { hasCareExpenses } = fullSchemaPensions.properties;

export const description = (
  <>
    <p>We want to know about your unreimbursed care expenses.</p>
    <p>
      Examples of unreimbursed care expenses include payments to in-home care
      providers, nursing homes, or other care facilities that insurance won’t
      cover.
    </p>
  </>
);

/** @type {PageSchema} */
export default {
  title: 'Care expenses',
  path: 'financial/care-expenses',
  uiSchema: {
    ...titleUI('Care expenses', description),
    hasCareExpenses: yesNoUI({
      title:
        "Do you, your spouse, or your dependents pay recurring care expenses that aren't reimbursed?",
    }),
  },
  schema: {
    type: 'object',
    required: ['hasCareExpenses'],
    properties: {
      hasCareExpenses,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
