import { RepIntroTitle } from '../content/representative';

export default {
  uiSchema: {
    'view:hasRep': {
      'ui:title': RepIntroTitle,
      'ui:widget': 'yesNo',
    },
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasRep': {
        type: 'boolean',
      },
    },
  },
};
