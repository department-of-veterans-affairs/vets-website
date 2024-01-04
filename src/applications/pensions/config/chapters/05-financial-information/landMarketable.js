import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { LandMarketableAlert } from '../../../components/FormAlerts';

const LandMarketableDescription = () => (
  <div>
    <p>We want to know if the additional land is marketable.</p>
    <LandMarketableAlert />
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Income and assets',
    'ui:description': LandMarketableDescription,
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
