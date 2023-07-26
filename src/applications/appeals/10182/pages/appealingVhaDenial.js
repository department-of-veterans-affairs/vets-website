import { content } from '../content/appealingVhaDenial';

const appealingVhaDenial = {
  uiSchema: {
    'ui:title': content.title,
    appealingVhaDenial: {
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
      appealingVhaDenial: {
        type: 'boolean',
      },
    },
  },
};

export default appealingVhaDenial;
