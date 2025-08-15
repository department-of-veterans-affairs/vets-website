import {
  currencyUI,
  currencySchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isHomeAcreageMoreThanTwo } from '../../../helpers';

export default {
  title: 'Home acreage value',
  path: 'financial/home-ownership/acres/value',
  depends: isHomeAcreageMoreThanTwo,
  uiSchema: {
    ...titleUI('Income and assets'),
    homeAcreageValue: currencyUI({
      title: 'What’s the value of the land that’s more than 2 acres?',
      hint: 'Don’t include the value of the residence or the first 2 acres',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      homeAcreageValue: currencySchema,
    },
  },
};
