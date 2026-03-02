/**
 * @module config/form/pages/examiner-email
 * @description Form page configuration for collecting the medical professional's email address
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 *
 * This page is part of the multi-party submission flow. The email collected here
 * is used to notify the medical professional to complete the examination portion
 * of the form (Sections VI-VIII).
 */

import {
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Examiner Email page
 * Collects the medical professional's email for multi-party notification
 */
export const examinerEmailUiSchema = {
  'ui:title': 'Medical professional information',
  'ui:description':
    'After you submit this form, we\u2019ll send an email to the medical professional you identify below. The email will include a link for them to complete the examination portion of this form (Sections VI\u2013VIII).',
  examinerNotification: {
    examinerEmail: emailUI('Medical professional\u2019s email address'),
  },
};

/**
 * JSON Schema for Examiner Email page
 * Validates the medical professional's email
 */
export const examinerEmailSchema = {
  type: 'object',
  required: ['examinerNotification'],
  properties: {
    examinerNotification: {
      type: 'object',
      required: ['examinerEmail'],
      properties: {
        examinerEmail: {
          ...emailSchema,
          maxLength: 70,
        },
      },
    },
  },
};
