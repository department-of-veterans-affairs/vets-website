import { CLAIMANT_TYPE, CLAIM_OWNERSHIP } from '../definitions/constants';

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
            case CLAIM_OWNERSHIP.SELF:
              title = 'Which of these descriptions best describes you?';
              uiSchemaCopy['ui:options'].labels = {
                veteran: 'I’m a Veteran',
                'non-veteran': 'I’m a non-Veteran claimant',
              };
              break;
            case CLAIM_OWNERSHIP.THIRD_PARTY:
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
        enum: [CLAIMANT_TYPE.VETERAN, CLAIMANT_TYPE.NON_VETERAN],
      },
    },
  },
};
