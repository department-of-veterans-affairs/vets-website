import React from 'react';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/**
 * Add Disabilities Page for Representative Form
 *
 * Simplified version that allows adding new conditions.
 * This is a local version to avoid dependencies on all-claims specific imports.
 */

export const uiSchema = {
  'ui:title': 'Conditions',
  'ui:description':
    'Enter the conditions the veteran wants to claim for disability compensation.',
  newDisabilities: {
    'ui:options': {
      itemName: 'Condition',
      viewField: ({ formData }) => <span>{formData?.condition}</span>,
      keepInPageOnReview: true,
      useDlWrap: true,
    },
    items: {
      condition: {
        'ui:title': 'Condition name',
        'ui:webComponentField': VaTextInputField,
        'ui:errorMessages': {
          required: 'Enter a condition name',
        },
        'ui:options': {
          hint: 'Enter the name of the condition as the veteran describes it',
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['condition'],
        properties: {
          condition: {
            type: 'string',
            minLength: 1,
            maxLength: 255,
          },
        },
      },
    },
  },
};

export default {
  uiSchema,
  schema,
};
