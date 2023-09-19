import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import { content } from '../content/appealingVhaDenial';

const appealingVhaDenial = {
  uiSchema: {
    appealingVHADenial: yesNoUI({
      title: content.title,
      enableAnalytics: true,
      labelHeaderLevel: '1',
      uswds: true,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      appealingVHADenial: {
        type: 'boolean',
      },
    },
  },

  review: data => ({
    'Are you appealing denial of VA health care benefits?': data.appealingVHADenial
      ? 'Yes'
      : 'No',
  }),
};

export default appealingVhaDenial;
