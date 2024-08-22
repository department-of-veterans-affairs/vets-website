import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

import { claimantRelationships } from '../../definitions/constants';

/** @type {UISchemaOptions} */
export const uiSchema = {
  'ui:description': () => {
    return (
      <>
        <h3>Tell us how you’re connected to the Veteran</h3>
      </>
    );
  },
  claimantRelationship: radioUI({
    title: 'What’s your relationship to the Veteran?',
    labels: claimantRelationships,
    errorMessages: {
      enum: 'Select one that best describes you',
      required: 'Select one that best describes you',
    },
    required: () => true,
  }),
  relationshipNotListed: {
    'ui:title': `Please describe your relationship to the Veteran`,
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      expandUnder: 'claimantRelationship',
      expandUnderCondition: 'RELATIONSHIP_NOT_LISTED',
      expandedContentFocus: true,
    },
    'ui:errorMessages': {
      required: `Please enter your relationship to the Veteran`,
    },
  },
  'ui:options': {
    updateSchema: (formData, formSchema) => {
      if (formSchema?.properties?.relationshipNotListed?.['ui:collapsed']) {
        return {
          ...formSchema,
          required: ['claimantRelationship'],
        };
      }
      return {
        ...formSchema,
        required: ['claimantRelationship', 'relationshipNotListed'],
      };
    },
  },
};

/** @type {UISchemaOptions} */
export const schema = {
  type: 'object',
  required: ['claimantRelationship'],
  properties: {
    claimantRelationship: radioSchema(Object.keys(claimantRelationships)),
    relationshipNotListed: { type: 'string' },
  },
};
