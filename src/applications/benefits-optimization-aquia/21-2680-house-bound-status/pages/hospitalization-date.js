/**
 * @module config/form/pages/hospitalization-date
 * @description Standard form system configuration for Hospitalization Date page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getHospitalizationDateTitle } from '../utils';

/**
 * uiSchema for Hospitalization Date page
 * Collects the date of hospital admission
 */
export const hospitalizationDateUiSchema = {
  hospitalizationDate: {
    admissionDate: currentOrPastDateUI({
      title: 'When was the claimant admitted to the hospital?',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const admissionDateLabel = getHospitalizationDateTitle(
        fullData || formData,
      );

      return {
        hospitalizationDate: {
          admissionDate: {
            'ui:title': admissionDateLabel,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Hospitalization Date page
 * Validates the admission date field
 */
export const hospitalizationDateSchema = {
  type: 'object',
  required: ['hospitalizationDate'],
  properties: {
    hospitalizationDate: {
      type: 'object',
      required: ['admissionDate'],
      properties: {
        admissionDate: currentOrPastDateSchema,
      },
    },
  },
};
