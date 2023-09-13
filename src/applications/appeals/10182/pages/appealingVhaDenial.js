import { content } from '../content/appealingVhaDenial';

const appealingVhaDenial = {
  uiSchema: {
    'ui:title': content.title,
    appealingVHADenial: {
      'ui:title': content.label,
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
};

export default appealingVhaDenial;
