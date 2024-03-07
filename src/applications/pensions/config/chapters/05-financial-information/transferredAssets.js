import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  IncomeAssetStatementFormAlert,
  AssetTransferInformationAlert,
} from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Income and assets'),
    'view:informationAlert': {
      'ui:description': AssetTransferInformationAlert,
    },
    transferredAssets: yesNoUI({
      title:
        'Did you, your spouse, or your dependents transfer any assets in the last 3 calendar years?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': IncomeAssetStatementFormAlert,
      'ui:options': {
        hideIf: formData => formData.transferredAssets !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['transferredAssets'],
    properties: {
      'view:informationAlert': {
        type: 'object',
        properties: {},
      },
      transferredAssets: yesNoSchema,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
