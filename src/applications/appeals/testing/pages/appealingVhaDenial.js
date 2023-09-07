import { content } from '../content/appealingVhaDenial';

const appealingVhaDenial = {
  uiSchema: {
    appealingVHADenial: {
      'ui:title': content.title,
      'ui:widget': 'yesNo',
      'ui:options': {
        enableAnalytics: true,
      },
    },
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
