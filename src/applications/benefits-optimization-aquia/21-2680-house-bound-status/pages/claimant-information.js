/**
 * @module config/form/pages/claimant-information
 * @description Standard form system configuration for Claimant Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  firstNameLastNameNoSuffixUI,
  firstNameLastNameNoSuffixSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const relationshipLabels = {
  veteran: 'Your',
  spouse: "Veteran's spouse's",
  child: "Veteran's child's",
  parent: "Veteran's parent's",
};

/**
 * uiSchema for Claimant Information page
 * Collects claimant's full name and date of birth
 */
export const claimantInformationUiSchema = {
  claimantInformation: {
    claimantFullName: firstNameLastNameNoSuffixUI(),
    claimantDob: dateOfBirthUI(),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const relationship = data?.claimantRelationship?.relationship;
      const title = `${relationshipLabels[relationship] ||
        'Claimant'} name and date of birth`;

      return {
        'ui:title': title,
      };
    },
  },
};

/**
 * JSON Schema for Claimant Information page
 * Validates claimant identification fields
 */
export const claimantInformationSchema = {
  type: 'object',
  required: ['claimantInformation'],
  properties: {
    claimantInformation: {
      type: 'object',
      required: ['claimantFullName', 'claimantDob'],
      properties: {
        claimantFullName: firstNameLastNameNoSuffixSchema,
        claimantDob: dateOfBirthSchema,
      },
    },
  },
};
