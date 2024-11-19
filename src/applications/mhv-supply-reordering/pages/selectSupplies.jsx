import React from 'react';
import SupplyField from '../components/SupplyField';
import SelectArrayItemsWidget from '../components/SelectArrayItemsWidget';
import { validateAtLeastOneSelected } from '../utils/validators';

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

export default {
  uiSchema: {
    'ui:description': Description,
    supplies: {
      'ui:title': 'Select available supplies for reorder',
      'ui:field': 'StringField',
      'ui:widget': SelectArrayItemsWidget,
      'ui:options': {
        showFieldLabel: true,
        viewField: SupplyField,
      },
      'ui:required': () => true,
      'ui:validations': [validateAtLeastOneSelected],
    },
  },
  schema: {
    type: 'object',
    properties: {
      supplies: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['supply'],
          properties: {
            supply: {
              type: 'object',
              properties: {
                productId: {
                  type: 'string',
                },
                productName: {
                  type: 'string',
                },
              },
            },
            'view:selected': {
              type: 'boolean',
              default: false,
            },
            'view:descriptionInfo': { type: 'object', properties: {} },
          },
        },
      },
    },
  },
};
