/**
 * @module config/form/pages/duty-status
 * @description Standard form system configuration for Duty Status page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName } from './helpers';

/**
 * Generate title for reserve or guard status field
 */
const getReserveOrGuardStatusTitle = formData => {
  if (!formData || typeof formData !== 'object')
    return 'Reserve or National Guard status';
  const veteranName = getVeteranName(formData);
  return `Is ${veteranName} currently in the Reserve or National Guard?`;
};

/**
 * uiSchema for Duty Status page
 * Collects information about Reserve or National Guard duty status
 */
export const dutyStatusUiSchema = {
  'ui:title': 'Reserve or National Guard duty status',
  dutyStatus: {
    reserveOrGuardStatus: yesNoUI({
      title: 'Reserve or National Guard status', // Default title, will be updated by updateUiSchema
      errorMessages: {
        required: 'Please select Yes or No',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      // Evaluate dynamic field title
      const reserveOrGuardStatusTitle = getReserveOrGuardStatusTitle(
        fullData || formData,
      );

      return {
        dutyStatus: {
          reserveOrGuardStatus: {
            'ui:title': reserveOrGuardStatusTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Duty Status page
 * Validates the Reserve/Guard status field
 */
export const dutyStatusSchema = {
  type: 'object',
  required: ['dutyStatus'],
  properties: {
    dutyStatus: {
      type: 'object',
      required: ['reserveOrGuardStatus'],
      properties: {
        reserveOrGuardStatus: yesNoSchema,
      },
    },
  },
};
