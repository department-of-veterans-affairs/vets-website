import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
} from 'platform/forms-system/src/js/web-component-patterns/ssnPattern';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Identification information',
      'You must enter either a Social Security number or a VA File number.',
    ),
    ...ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      ...ssnOrVaFileNumberNoHintSchema.properties,
    },
    required: ssnOrVaFileNumberNoHintSchema.required,
  },
};
