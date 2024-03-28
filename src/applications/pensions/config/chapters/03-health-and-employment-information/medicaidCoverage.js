import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isInNursingHome } from './helpers';

/** @type {PageSchema} */
export default {
  title: 'Medicaid coverage',
  path: 'medical/history/nursing/medicaid',
  depends: isInNursingHome,
  uiSchema: {
    ...titleUI('Medicaid coverage'),
    medicaidCoverage: yesNoUI({
      title: 'Does Medicaid cover all or part of your nursing home costs?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      medicaidCoverage: yesNoSchema,
    },
  },
};
