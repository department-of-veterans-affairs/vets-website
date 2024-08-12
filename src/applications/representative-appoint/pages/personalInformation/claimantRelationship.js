import React from 'react';
import {
  radioSchema,
  radioUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
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
    labels: {
      [claimantRelationships.veteran]: 'I’m the Veteran’s spouse',
      [claimantRelationships.spouse]: 'I’m the Veteran’s child',
      [claimantRelationships.child]: 'I’m the Veteran’s parent',
      [claimantRelationships.accreditedRepresentative]:
        'I’m the Veteran’s accredited representative',
      [claimantRelationships.relationshipNotListed]:
        'We don’t have a relationship that’s listed here',
    },
    errorMessages: {
      enum: 'Select one that best describes you',
      required: 'Select one that best describes you',
    },
  }),
};

/** @type {UISchemaOptions} */
export const schema = {
  type: 'object',
  required: ['claimantRelationship'],
  properties: {
    claimantRelationship: radioSchema(Object.values(claimantRelationships)),
  },
};
