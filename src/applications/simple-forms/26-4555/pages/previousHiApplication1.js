const previousHiApplication1 = {
  uiSchema: {
    hasPreviousHiApplication: {
      'ui:title':
        'Have you previously applied for a home improvement or structural alteration grant?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['hasPreviousHiApplication'],
    properties: {
      hasPreviousHiApplication: {
        type: 'boolean',
      },
    },
  },
};

export default previousHiApplication1;
