import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { ownsHome } from './helpers';

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
      homeAcreageMoreThanTwo: yesNoSchema,
    },
  },
};
