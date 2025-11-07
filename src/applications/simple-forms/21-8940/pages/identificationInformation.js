// @ts-check
import {
  titleUI,
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your identification information',
      'You must enter a Social Security number or VA file number',
    ),
    ssnOrVaFileNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ssnOrVaFileNumber: ssnOrVaFileNumberNoHintSchema,
    },
    required: ['ssnOrVaFileNumber'],
  },
};
