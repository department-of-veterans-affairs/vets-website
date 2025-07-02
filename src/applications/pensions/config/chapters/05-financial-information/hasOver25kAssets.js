import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { AssetsInformation } from '../../../components/FormAlerts';
import { showIncomeAndAssetsClarification } from '../../../helpers';

const { totalNetWorth } = fullSchemaPensions.properties;

const path = showIncomeAndAssetsClarification()
  ? 'financial/income-and-assets'
  : 'temporarily-hidden-income-and-assets';

/** @type {PageSchema} */
export default {
  title: 'Income and assets',
  path,
  depends: () => showIncomeAndAssetsClarification(),
  uiSchema: {
    ...titleUI(
      'Income and assets',
      'We need to know if you and your dependents have over $25,000 in combined assets.',
    ),
    'view:AssetsInformation': {
      'ui:description': AssetsInformation,
    },
    totalNetWorth: yesNoUI({
      title: 'Do you and your dependents have over $25,000 in combined assets?',
    }),
  },
  schema: {
    type: 'object',
    required: ['totalNetWorth'],
    properties: {
      'view:AssetsInformation': {
        type: 'object',
        properties: {},
      },
      totalNetWorth,
    },
  },
};
