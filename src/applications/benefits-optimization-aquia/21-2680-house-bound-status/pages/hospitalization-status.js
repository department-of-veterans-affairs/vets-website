/**
 * @module config/form/pages/hospitalization-status
 * @description Standard form system configuration for Hospitalization Status page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Generate page title based on claimant relationship
 */
const getPageTitle = formData => {
  const isVeteran = formData?.claimantRelationship?.relationship === 'veteran';

  if (isVeteran) {
    // Get veteran's name
    const firstName =
      formData?.veteranInformation?.veteranFullName?.first || '';
    const lastName = formData?.veteranInformation?.veteranFullName?.last || '';
    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) {
      return `Is ${fullName} hospitalized?`;
    }
    return 'Is the Veteran hospitalized?';
  }

  // Get claimant's name
  const firstName =
    formData?.claimantInformation?.claimantFullName?.first || '';
  const lastName = formData?.claimantInformation?.claimantFullName?.last || '';
  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return `Is ${fullName} hospitalized?`;
  }
  return 'Is the claimant hospitalized?';
};

/**
 * uiSchema for Hospitalization Status page
 * Determines if the claimant is currently hospitalized
 */
export const hospitalizationStatusUiSchema = {
  hospitalizationStatus: {
    isCurrentlyHospitalized: yesNoUI({
      title: 'Is the claimant hospitalized?',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const fieldLabel = getPageTitle(fullData || formData);
      return {
        hospitalizationStatus: {
          isCurrentlyHospitalized: {
            'ui:title': fieldLabel,
          },
        },
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
