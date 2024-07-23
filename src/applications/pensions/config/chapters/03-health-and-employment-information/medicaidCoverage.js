import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { isInNursingHome } from './helpers';

const { medicaidCoverage } = fullSchemaPensions.properties;

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
      medicaidCoverage,
    },
  },
};
