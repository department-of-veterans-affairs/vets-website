import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { ownsHome } from './helpers';

const { homeAcreageMoreThanTwo } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Home acreage size',
  path: 'financial/home-ownership/acres',
  depends: ownsHome,
  uiSchema: {
    ...titleUI('Income and assets'),
    homeAcreageMoreThanTwo: yesNoUI({
      title:
        'Is your home located on a lot of land that’s more than 2 acres (or 87,120 square feet)?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeAcreageMoreThanTwo,
    },
  },
};
