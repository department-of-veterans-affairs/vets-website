import React from 'react';
// import { validateAtLeastOneSelected } from '../utils/validators';
import { checkboxGroupSchema } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const Description = ({ formData }) => {
  const count = formData?.supplies?.length || 0;

  return (
    <>
      <h3>Available for reorder</h3>
      <p>
        You have {count} {count > 1 ? 'supplies' : 'supply'} that are available
        for reorder.
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
    chosenSupplies: {
      title: 'Select available supplies for reorder',
      labels: {},
      required: false,
      replaceSchema: formData =>
        checkboxGroupSchema(formData?.supplies?.map(s => s.productId)),
      updateUiSchema: formData =>
        formData?.supplies?.reduce(
          (acc, s) => ({ ...acc, [s.productId]: s.productName }),
          {},
        ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      chosenSupplies: checkboxGroupSchema([]),
    },
  },
};
