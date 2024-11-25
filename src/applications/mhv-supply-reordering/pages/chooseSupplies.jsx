import React from 'react';
// import { validateAtLeastOneSelected } from '../utils/validators';
import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import {
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
  suppliesUi,
} from '../utils/helpers';

const numberOfSuppliesPhrase = count => {
  if (count > 1) return `${count} supplies`;
  if (count < 1) return 'no supplies';
  return `${count} supply`;
};

const Description = ({ formData }) => {
  const count = formData?.supplies?.length || 0;

  return (
    <>
      <h3>Available for reorder</h3>
      <p>
        You have {numberOfSuppliesPhrase(count)} that are available for reorder.
      </p>
      <p>
        <strong>Note:</strong> For CPAP supplies, each order is a 12-month
        supply. You can only order each item once every 12 months.
      </p>
      <p>
        For hearing aid supplies, each order is a 6-month supply. You can only
        order each item once every 6 months.
      </p>
    </>
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': Description,
    chosenSupplies: suppliesUi({
      title: 'Select available supplies for reorder',
      replaceSchema: suppliesReplaceSchema,
      updateUiSchema: suppliesUpdateUiSchema,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      chosenSupplies: checkboxGroupSchema([]),
    },
  },
};
