/**
 * @module config/form/pages/duty-status-details
 * @description Standard form system configuration for Duty Status Details page
 * VA Form 21-4192 - Request for Employment Information
 */

import {
  textareaUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName } from './helpers';

/**
 * Generate title for current duty status field
 */
const getCurrentDutyStatusTitle = formData => {
  if (!formData || typeof formData !== 'object') return 'Current duty status';
  const veteranName = getVeteranName(formData);
  return `What is ${veteranName}'s current duty status?`;
};

/**
 * Generate title for disabilities prevent duties field
 */
const getDisabilitiesPreventDutiesTitle = formData => {
  if (!formData || typeof formData !== 'object')
    return 'Disabilities prevent duties';
  const veteranName = getVeteranName(formData);
  return `Does ${veteranName} have any disabilities that prevent them from performing their military duties?`;
};

/**
 * uiSchema for Duty Status Details page
 * Collects additional details about Reserve or National Guard duty status
 * This page is conditional - only shown if reserveOrGuardStatus === true
 */
export const dutyStatusDetailsUiSchema = {
  'ui:title': 'Reserve or National Guard duty status',
  dutyStatusDetails: {
    currentDutyStatus: textareaUI({
      title: 'Current duty status',
      charcount: true,
      errorMessages: {
        required: 'Current duty status is required',
        maxLength: 'Current duty status must be less than 500 characters',
      },
    }),
    disabilitiesPreventDuties: yesNoUI({
      title: 'Disabilities prevent duties',
      errorMessages: {
        required: 'Please select Yes or No',
      },
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const currentDutyStatusTitle = getCurrentDutyStatusTitle(
        fullData || formData,
      );
      const disabilitiesPreventDutiesTitle = getDisabilitiesPreventDutiesTitle(
        fullData || formData,
      );

      return {
        dutyStatusDetails: {
          currentDutyStatus: {
            'ui:title': currentDutyStatusTitle,
          },
          disabilitiesPreventDuties: {
            'ui:title': disabilitiesPreventDutiesTitle,
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Duty Status Details page
 * Validates duty status fields
 */
export const dutyStatusDetailsSchema = {
  type: 'object',
  required: ['dutyStatusDetails'],
  properties: {
    dutyStatusDetails: {
      type: 'object',
      required: ['currentDutyStatus', 'disabilitiesPreventDuties'],
      properties: {
        currentDutyStatus: {
          type: 'string',
          maxLength: 500,
        },
        disabilitiesPreventDuties: yesNoSchema,
      },
    },
  },
};
