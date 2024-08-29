import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  AssetInformationAlert,
  RequestIncomeAndAssetInformationAlert,
} from '../../../components/FormAlerts';
import { showIncomeAndAssetsClarification } from '../../../helpers';

const { totalNetWorth } = fullSchemaPensions.properties;

// TODO: Remove this page when pension_income_and_assets_clarification flipper is removed

const path = !showIncomeAndAssetsClarification()
  ? 'financial/total-net-worth'
  : 'temporarily-hidden-total-net-worth';

/** @type {PageSchema} */
export default {
  title: path,
  path: 'financial/total-net-worth',
  depends: () => !showIncomeAndAssetsClarification(),
  uiSchema: {
    ...titleUI(
      'Income and assets',
      'We need to know if you and your dependents have over $25,000 in assets.',
    ),
    'view:warningAlert': {
      'ui:description': AssetInformationAlert,
    },
    totalNetWorth: yesNoUI({
      title: 'Do you and your dependents have over $25,000 in assets?',
    }),
    'view:warningAlertOnYes': {
      'ui:description': RequestIncomeAndAssetInformationAlert,
      'ui:options': {
        hideIf: formData => formData.totalNetWorth !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['totalNetWorth'],
    properties: {
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
      totalNetWorth,
      'view:warningAlertOnYes': {
        type: 'object',
        properties: {},
      },
    },
  },
};
