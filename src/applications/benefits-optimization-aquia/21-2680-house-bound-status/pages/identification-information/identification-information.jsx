/**
 * @module pages/identification-information
 * @description Page configuration for veteran's SSN or VA file number
 */

import {
  titleUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Identification information page configuration
 * Collects either Social Security Number or VA File Number
 * @type {PageSchema}
 */
export const identificationInformation = {
  uiSchema: {
    ...titleUI(
      'Identification information',
      'You must enter a Social Security number or VA file number',
    ),
    veteranId: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
