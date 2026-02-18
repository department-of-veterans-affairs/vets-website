/**
 * @module config/form/pages/claimant-relationship
 * @description Standard form system configuration for Claimant Relationship page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Relationship page
 * Determines the relationship of the claimant to the veteran
 */
export const claimantRelationshipUiSchema = {
  claimantRelationship: {
    relationship: radioUI({
      title: 'What is your relationship to the Veteran?',
      labels: {
        veteran: 'Veteran',
        spouse: "Veteran's spouse",
        child: "Veteran's child",
        parent: "Veteran's parent",
      },
    }),
  },
};

/**
 * JSON Schema for Claimant Relationship page
 * Validates the relationship field
 */
export const claimantRelationshipSchema = {
  type: 'object',
  required: ['claimantRelationship'],
  properties: {
    claimantRelationship: {
      type: 'object',
      required: ['relationship'],
      properties: {
        relationship: radioSchema(['veteran', 'spouse', 'child', 'parent']),
      },
    },
  },
};
