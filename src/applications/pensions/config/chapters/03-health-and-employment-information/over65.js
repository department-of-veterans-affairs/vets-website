import {
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { isOver65 } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Your age',
  path: 'medical/history/age',
  uiSchema: {
    ...titleUI('Tell us your age'),
    isOver65: yesNoUI({
      title: 'Are you at least 65 years old?',
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
