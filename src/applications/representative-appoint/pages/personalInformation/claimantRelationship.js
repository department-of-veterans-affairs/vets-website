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
      [claimantRelationships.veteran]:
        'I’m a Veteran, and I intend to file a VA claim for myself',
      [claimantRelationships.spouseOrChild]:
        'I’m the spouse or child of a Veteran, and I intend to file a VA claim for myself',
      [claimantRelationships.veteranRepresentative]:
        'I’m representing a Veteran who intends to file a VA claim',
      [claimantRelationships.spouseOrChildRepresentative]:
        'I’m representing a Veteran’s spouse or child who intends to file a VA claim (called the claimant in this form)',
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
