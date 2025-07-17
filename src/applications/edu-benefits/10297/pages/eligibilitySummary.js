import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import EligibilitySummaryInfo from './eligibilitySummaryInfo';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('High Technology Program eligibility summary'),
    'view:summary': {
      'ui:description': EligibilitySummaryInfo,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:summary': {
        type: 'object',
        properties: {},
      },
    },
  },
};
