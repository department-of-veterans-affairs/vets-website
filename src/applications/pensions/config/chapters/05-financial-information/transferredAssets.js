import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { AssetTransferInformationAlert } from '../../../components/FormAlerts';

const { transferredAssets } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Transferred assets',
  path: 'financial/transferred-assets',
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
  },
  schema: {
    type: 'object',
    required: ['transferredAssets'],
    properties: {
      'view:informationAlert': {
        type: 'object',
        properties: {},
      },
      transferredAssets,
    },
  },
};
