import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { LandMarketableAlert } from '../../../components/FormAlerts';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    'ui:description': LandMarketableAlert,
    landMarketable: yesNoUI({
      title: 'Is the additional land marketable?',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      landMarketable: yesNoSchema,
    },
  },
};
