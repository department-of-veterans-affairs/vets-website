/**
 * @module config/form/pages/benefit-type
 * @description Standard form system configuration for Benefit Type page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import React from 'react';
import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName, isClaimantVeteran } from './helpers';

/**
 * Generate page title based on claimant relationship
 */
const getPageTitle = formData => {
  if (isClaimantVeteran(formData)) {
    return 'Select which benefit you are applying for';
  }
  const claimantName = getClaimantName(formData);
  return `Select which benefit ${claimantName} is applying for`;
};

/**
 * uiSchema for Benefit Type page
 * Selects between Special Monthly Compensation (SMC) and Special Monthly Pension (SMP)
 */
export const benefitTypeUiSchema = {
  'ui:title': 'Benefit type',
  'ui:description': () => (
    <p>
      <a
        href="https://www.va.gov/pension/aid-attendance-housebound/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find out more about the difference between Special Monthly Compensation
        (SMC) and Special Monthly Pension (SMP).
      </a>
    </p>
  ),
  benefitType: {
    benefitType: radioUI({
      title: 'Select benefit type',
      labels: {
        SMC: 'Special Monthly Compensation (SMC)',
        SMP: 'Special Monthly Pension (SMP)',
      },
      descriptions: {
        SMC:
          'is paid in addition to compensation or Dependency Indemnity Compensation (DIC) for a service-related disability.',
        SMP:
          'is an increased monthly amount paid to a Veteran or survivor who is eligible for Veterans Pension or Survivors benefits.',
      },
      tile: true,
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
 * JSON Schema for Benefit Type page
 * Validates the benefit type selection
 */
export const benefitTypeSchema = {
  type: 'object',
  required: ['benefitType'],
  properties: {
    benefitType: {
      type: 'object',
      required: ['benefitType'],
      properties: {
        benefitType: radioSchema(['SMC', 'SMP']),
      },
    },
  },
};
