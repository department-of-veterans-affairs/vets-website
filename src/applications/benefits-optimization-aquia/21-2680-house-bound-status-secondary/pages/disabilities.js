/**
 * @module pages/disabilities
 * @description Standard form system configuration for Disabilities page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import { textUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Disabilities page
 * Collects up to five permanent and totally disabling disabilities
 */
export const disabilitiesUiSchema = {
  'ui:title': 'Disabilities',
  'ui:description':
    'What disability(ies) are considered permanent and totally disabling? Describe below.',
  disabilityA: textUI('A'),
  disabilityB: textUI('B'),
  disabilityC: textUI('C'),
  disabilityD: textUI('D'),
  disabilityF: textUI('F'),
};

/**
 * JSON Schema for Disabilities page
 * Validates disability text fields (A through F)
 */
export const disabilitiesSchema = {
  type: 'object',
  properties: {
    disabilityA: { type: 'string' },
    disabilityB: { type: 'string' },
    disabilityC: { type: 'string' },
    disabilityD: { type: 'string' },
    disabilityF: { type: 'string' },
  },
};
