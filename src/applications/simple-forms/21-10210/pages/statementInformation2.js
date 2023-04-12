export default {
  uiSchema: {
    claimantType: {
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: formData => formData.claimOwnership === undefined,
        updateSchema: (formData, schema, uiSchema) => {
          const { claimOwnership } = formData;
          const uiSchemaCopy = { ...uiSchema };
          let title;
          switch (claimOwnership) {
            case 'self':
              title = 'Which of these descriptions best describes you?';
              uiSchemaCopy['ui:options'].labels = {
                veteran: 'I’m a Veteran',
                'non-veteran': 'I’m a non-Veteran claimant',
              };
              break;
            case 'third-party':
              title =
                'Which of these individuals are you submitting a statement for?';
              uiSchemaCopy['ui:options'].labels = {
                veteran: 'A Veteran',
                'non-veteran': 'A non-Veteran claimant',
              };
              break;
            default:
              title = 'Claimant type:';
          }

          return {
            title,
            uiSchemaCopy,
          };
        },
        labels: {
          veteran: 'Veteran',
          'non-veteran': 'Non-Veteran',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      claimantType: {
        type: 'string',
        enum: ['veteran', 'non-veteran'],
      },
    },
  },
};
