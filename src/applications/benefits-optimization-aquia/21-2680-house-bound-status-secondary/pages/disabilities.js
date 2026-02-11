/**
 *
 */

import { textUI } from 'platform/forms-system/src/js/web-component-patterns';

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
