/**
 * @module config/form/pages/hospitalization-status
 * @description Standard form system configuration for Hospitalization Status page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getHospitalizationStatusTitle } from '../utils';

/**
 * uiSchema for Hospitalization Status page
 * Determines if the claimant is currently hospitalized
 */
export const hospitalizationStatusUiSchema = {
  hospitalizationStatus: {
    isCurrentlyHospitalized: yesNoUI({
      title: 'Is the claimant receiving hospital care?',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const fieldLabel = getHospitalizationStatusTitle(fullData || formData);
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
