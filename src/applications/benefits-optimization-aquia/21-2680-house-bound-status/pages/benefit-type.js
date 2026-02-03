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
import { isClaimantVeteran } from '../utils';

/**
 * Generate radio button title based on claimant relationship
 */
const getRadioTitle = formData => {
  if (isClaimantVeteran(formData)) {
    return 'Select which benefit you are applying for ';
  }

  // Get claimant's actual name
  const firstName =
    formData?.claimantInformation?.claimantFullName?.first || '';
  const lastName = formData?.claimantInformation?.claimantFullName?.last || '';
  const fullName = `${firstName} ${lastName}`.trim();

  // If we have a name, use it; otherwise fallback to "you are"
  if (fullName) {
    return `Select which benefit ${fullName} is applying for `;
  }
  return 'Select which benefit you are applying for ';
};

/**
 * uiSchema for Benefit Type page
 * Selects between Special Monthly Compensation (SMC) and Special Monthly Pension (SMP)
 */
export const benefitTypeUiSchema = {
  'ui:title': 'Which benefit should I apply for?',
  'ui:description': () => (
    <>
      <p>
        If you are not sure which benefit you are eligible for, learn more about
        Special Monthly Compensation and Special Monthly Pension.
      </p>
      <va-accordion>
        <va-accordion-item header="Special Monthly Compensation (SMC)" id="smc">
          <p>
            SMC benefits are paid in addition to monthly compensation or
            Dependency Indemnity Compensation (DIC). Apply for Special Monthly
            Compensation (SMC) if you:
          </p>
          <ul>
            <li>
              Are a Veteran or the surviving spouse or parent of a Veteran
            </li>
            <li>Require help with everyday tasks</li>
            <li>Are housebound (because of permanent disability)</li>
            <li>
              Are currently receiving, or are eligible for monthly compensation
              or Dependency Indemnity Compensation (DIC). SMC benefits are not
              paid without eligibility to compensation.
            </li>
          </ul>
        </va-accordion-item>
        <va-accordion-item header="Special Monthly Pension (SMP)" id="smp">
          <p>
            SMP is an increased monthly amount paid to a Veteran or survivor who
            is eligible for Veterans Pension or Survivors pension. Apply for
            Special Monthly Pension (SMP) if you:
          </p>
          <ul>
            <li>Are a Veteran or the surviving spouse of a Veteran</li>
            <li>Require help with everyday tasks</li>
            <li>Are housebound (because of permanent disability)</li>
            <li>
              Currently receive, or are eligible for, Veteran’s Pension and/or
              Survivors pension
            </li>
          </ul>
        </va-accordion-item>
      </va-accordion>
    </>
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
          'is paid in addition to compensation or Dependency Indemnity Compensation (DIC)',
        SMP:
          'is an increased monthly amount paid to a Veteran or survivor who is eligible for Veterans Pension or Survivors pension',
      },
      tile: true,
      labelHeaderLevel: 3,
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const radioTitle = getRadioTitle(formData || fullData);
      return {
        benefitType: {
          benefitType: {
            'ui:title': radioTitle,
          },
        },
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
