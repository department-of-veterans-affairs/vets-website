import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { isOver65 } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Age',
  path: 'medical/history/age',
  uiSchema: {
    isOver65: yesNoUI({
      title: 'Are you 65 years old or older?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['isOver65'],
    properties: {
      isOver65,
    },
  },
};
