import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { homeOwnership } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Home ownership',
  path: 'financial/home-ownership',
  uiSchema: {
    ...titleUI('Income and assets'),
    homeOwnership: yesNoUI({
      title:
        'Do you, your spouse, or your dependents own your home (also known as your primary residence)?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeOwnership,
    },
  },
};
