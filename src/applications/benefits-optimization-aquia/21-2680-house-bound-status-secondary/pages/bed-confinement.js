/**
 * @module pages/bed-confinement
 * @description Standard form system configuration for Bed Confinement page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects hours the patient is confined to bed during nighttime and daytime.
 */

import {
  numberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Bed Confinement page
 * Collects nighttime (9PM-9AM) and daytime (9AM-9PM) bed confinement hours
 */
export const bedConfinementUiSchema = {
  ...titleUI(
    'Bed confinement',
    'If the patient is confined to bed, indicate the number of hours in bed.',
  ),
  nighttimeHours: numberUI({
    title: 'From 9PM to 9AM',
    inputSuffix: 'hours',
    min: 0,
    max: 12,
    errorMessages: {
      required: 'Nighttime hours are required',
    },
  }),
  daytimeHours: numberUI({
    title: 'From 9AM to 9PM',
    inputSuffix: 'hours',
    min: 0,
    max: 12,
    errorMessages: {
      required: 'Daytime hours are required',
    },
  }),
};

/**
 * JSON Schema for Bed Confinement page
 * Validates nighttime and daytime confinement hours
 */
export const bedConfinementSchema = {
  type: 'object',
  required: ['nighttimeHours', 'daytimeHours'],
  properties: {
    nighttimeHours: { type: 'string', maxLength: 2 },
    daytimeHours: { type: 'string', maxLength: 2 },
  },
};
