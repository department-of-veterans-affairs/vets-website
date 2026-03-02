/**
 * @module config/form/pages/certification-level-of-care
 * @description Standard form system configuration for Certification Level of Care page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { getPatientName } from '../utils';

/**
 * uiSchema for Certification Level of Care page
 * Certifies the level of care the patient is receiving
 */
export const certificationLevelOfCareUiSchema = {
  certificationLevelOfCare: {
    levelOfCare: radioUI({
      title: 'Level of care',
      labels: {
        skilled: 'Skilled nursing care',
        intermediate: 'Intermediate nursing care',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientName = getPatientName(data);

      const title = `I certify that ${patientName} is a patient in this facility because of a mental or physical disability and is receiving the following care`;

      return {
        certificationLevelOfCare: {
          levelOfCare: {
            'ui:title': title,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Certification Level of Care page
 * Validates level of care selection
 */
export const certificationLevelOfCareSchema = {
  type: 'object',
  required: ['certificationLevelOfCare'],
  properties: {
    certificationLevelOfCare: {
      type: 'object',
      required: ['levelOfCare'],
      properties: {
        levelOfCare: radioSchema(['skilled', 'intermediate']),
      },
    },
  },
};
