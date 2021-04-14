export default {
  uiSchema: {
    'view:hasRep': {
      'ui:title': `Do you have a representative, like a Veteran Service
        Organization (VSO) or a VA-accredited attorney or agent helping you file
        this appeal?`,
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
