/**
 * @module config/form/pages/duty-status
 * @description Standard form system configuration for Duty Status page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Duty Status page
 * Collects information about Reserve or National Guard duty status
 */
export const dutyStatusUiSchema = {
  'ui:title': 'Reserve or National Guard duty status',
  dutyStatus: {
    reserveOrGuardStatus: yesNoUI({
      title:
        "Are you the Veteran's Reserve or National Guard Unit Commander or Designee?",
      errorMessages: {
        required: 'Please select Yes or No',
      },
    }),
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
