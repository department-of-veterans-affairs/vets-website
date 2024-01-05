import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import {
  AssetTransferFormAlert,
  AssetTransferInformationAlert,
} from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    'view:informationAlert': {
      'ui:description': AssetTransferInformationAlert,
    },
    transferredAssets: yesNoUI({
      title:
        'Did you, your spouse or your dependents transfer any assets in the last 3 calendar years?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    'view:warningAlert': {
      'ui:description': AssetTransferFormAlert,
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
