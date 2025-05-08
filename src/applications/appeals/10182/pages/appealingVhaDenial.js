import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { content } from '../content/appealingVhaDenial';

const appealingVhaDenial = {
  uiSchema: {
    'ui:title': content.title,
    appealingVHADenial: yesNoUI({
      title: content.label,
      enableAnalytics: true,
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      uswds: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      appealingVHADenial: yesNoSchema,
    },
  },
};

export default appealingVhaDenial;
