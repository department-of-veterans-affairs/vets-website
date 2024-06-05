import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  AssetInformationAlert,
  RequestIncomeAndAssetInformationAlert,
} from '../../../components/FormAlerts';

const { totalNetWorth } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Total net worth',
  path: 'financial/total-net-worth',
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
