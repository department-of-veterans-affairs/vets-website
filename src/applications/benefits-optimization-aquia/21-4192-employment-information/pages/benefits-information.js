/**
 * @module config/form/pages/benefits-information
 * @description Standard form system configuration for Benefits Information page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName } from './helpers';

/**
 * Generate title for benefit entitlement field
 */
const getBenefitEntitlementTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Benefit entitlement';
  const veteranName = getVeteranName(formData);
  return `As a result of their employment with you, is ${veteranName} receiving or entitled to receive sick, retirement, or other benefits?`;
};

/**
 * uiSchema for Benefits Information page
 * Collects information about benefit entitlements
 */
export const benefitsInformationUiSchema = {
  'ui:title': 'Benefit entitlement and/or payments',
  benefitsInformation: {
    benefitEntitlement: yesNoUI({
      title: 'Benefit entitlement', // Default title, will be updated by updateUiSchema
      errorMessages: {
        required: 'Please select Yes or No',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field title
      const benefitEntitlementTitle = getBenefitEntitlementTitle(
        fullData || formData,
      );

      return {
        benefitsInformation: {
          benefitEntitlement: {
            'ui:title': benefitEntitlementTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Benefits Information page
 * Validates the benefit entitlement field
 */
export const benefitsInformationSchema = {
  type: 'object',
  required: ['benefitsInformation'],
  properties: {
    benefitsInformation: {
      type: 'object',
      required: ['benefitEntitlement'],
      properties: {
        benefitEntitlement: yesNoSchema,
      },
    },
  },
};
