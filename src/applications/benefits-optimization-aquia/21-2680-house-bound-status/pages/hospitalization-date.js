/**
 * @module config/form/pages/hospitalization-date
 * @description Standard form system configuration for Hospitalization Date page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName, isClaimantVeteran } from './helpers';

/**
 * Generate admission date label based on claimant relationship
 */
const getAdmissionDateLabel = formData => {
  if (isClaimantVeteran(formData)) {
    return 'When were you admitted to the hospital?';
  }
  const claimantName = getClaimantName(formData);
  return `When was ${claimantName} admitted to the hospital?`;
};

/**
 * uiSchema for Hospitalization Date page
 * Collects the date of hospital admission
 */
export const hospitalizationDateUiSchema = {
  'ui:title': 'Date of hospital admission',
  hospitalizationDate: {
    admissionDate: currentOrPastDateUI({
      title: 'Date of hospital admission',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const admissionDateLabel = getAdmissionDateLabel(fullData || formData);
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
