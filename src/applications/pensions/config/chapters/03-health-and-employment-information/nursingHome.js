import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { nursingHome } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Nursing home information',
  path: 'medical/history/nursing-home',
  uiSchema: {
    ...titleUI('Nursing home information'),
    nursingHome: yesNoUI({
      title: 'Do you live in a nursing home?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['nursingHome'],
    properties: {
      nursingHome,
    },
  },
};
