import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { AssetsInformation } from '../../../components/FormAlerts';
import { showPdfFormAlignment } from '../../../helpers';

const { totalNetWorth } = fullSchemaPensions.properties;

const threshold = showPdfFormAlignment() ? 75000 : 25000;

/** @type {PageSchema} */
export default {
  title: 'Total net worth',
  path: 'financial/total-net-worth',
  uiSchema: {
    ...titleUI(
      'Income and assets',
      `We need to know if you and your dependents have over $${threshold.toLocaleString()} in combined assets.`,
    ),
    'view:AssetsInformation': {
      'ui:description': AssetsInformation,
    },
    totalNetWorth: yesNoUI({
      title: `Do you and your dependents have over $${threshold.toLocaleString()} in combined assets?`,
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
