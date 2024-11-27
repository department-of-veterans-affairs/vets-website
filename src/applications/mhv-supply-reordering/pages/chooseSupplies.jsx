import React from 'react';
// import { validateAtLeastOneSelected } from '../utils/validators';
import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import {
  numberOfSuppliesPhrase,
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
  suppliesUi,
} from '../utils/helpers';

const Description = ({ formData }) => {
  const count = formData?.supplies?.length || 0;

  return (
    <>
      <h3>Available for reorder</h3>
      <p>
        You have {numberOfSuppliesPhrase(count)} that are available for reorder.
      </p>
      <p>
        <strong>Note:</strong> We’ll send you a 6-month supply of each item
        added to your order. You can only order each item once every 5 months.
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
