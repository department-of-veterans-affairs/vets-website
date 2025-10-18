/**
 * @module pages/identification-information
 * @description Page configuration for veteran identification information
 */

import {
  titleUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * Page configuration for identification information
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

// Platform expects default export for pages
export default identificationInformation;
