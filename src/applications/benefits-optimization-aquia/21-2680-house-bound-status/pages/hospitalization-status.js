/**
 * @module config/form/pages/hospitalization-status
 * @description Standard form system configuration for Hospitalization Status page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName, isClaimantVeteran } from './helpers';

/**
 * Generate page title based on claimant relationship
 */
const getPageTitle = formData => {
  if (isClaimantVeteran(formData)) {
    return 'Are you hospitalized?';
  }
  const claimantName = getClaimantName(formData);
  return `Is ${claimantName} hospitalized?`;
};

/**
 * uiSchema for Hospitalization Status page
 * Determines if the claimant is currently hospitalized
 */
export const hospitalizationStatusUiSchema = {
  'ui:title': 'Hospitalization status',
  hospitalizationStatus: {
    isCurrentlyHospitalized: yesNoUI({
      title: 'Hospitalization status',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const pageTitle = getPageTitle(fullData || formData);
      return {
        'ui:title': pageTitle,
      };
    },
  },
};

/**
 * JSON Schema for Hospitalization Status page
 * Validates the hospitalization status field
 */
export const hospitalizationStatusSchema = {
  type: 'object',
  required: ['hospitalizationStatus'],
  properties: {
    hospitalizationStatus: {
      type: 'object',
      required: ['isCurrentlyHospitalized'],
      properties: {
        isCurrentlyHospitalized: yesNoSchema,
      },
    },
  },
};
