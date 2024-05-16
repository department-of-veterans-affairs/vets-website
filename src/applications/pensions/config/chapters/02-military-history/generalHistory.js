import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { serveUnderOtherNames } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'General history',
  path: 'military/general',
  uiSchema: {
    ...titleUI('Other service names'),
    serveUnderOtherNames: yesNoUI({
      title: 'Did you serve under another name?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['serveUnderOtherNames'],
    properties: {
      serveUnderOtherNames,
    },
  },
};
