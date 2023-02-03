const previousSahApplication1 = {
  uiSchema: {
    hasPreviousSahApplication: {
      'ui:title':
        'Have you previously applied for specially adapted housing or special home adaptation grant?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['hasPreviousSahApplication'],
    properties: {
      hasPreviousSahApplication: {
        type: 'boolean',
      },
    },
  },
};

export default previousSahApplication1;
