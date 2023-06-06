import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

export default {
  uiSchema: {
    claimantType: {
      'ui:widget': 'radio',
      'ui:options': {
        hideIf: formData => formData.claimOwnership === undefined,
        updateSchema: (formData, schema, uiSchema) => {
          const { claimOwnership } = formData;
          let labels = { veteran: 'Veteran', 'non-veteran': 'Non-Veteran' };
          let title;

          switch (claimOwnership) {
            case CLAIM_OWNERSHIPS.SELF:
              title = 'Which of these descriptions best describes you?';
              labels = {
                veteran: 'I’m a Veteran',
                'non-veteran': 'I’m a non-Veteran claimant',
              };
              break;
            case CLAIM_OWNERSHIPS.THIRD_PARTY:
              title =
                'Which of these individuals are you submitting a statement for?';
              labels = {
                veteran: 'A Veteran',
                'non-veteran': 'A non-Veteran claimant',
              };
              break;
            default:
              title = 'Claimant type:';
          }

          // eslint-disable-next-line no-param-reassign
          uiSchema['ui:options'].labels = labels;

          return {
            title,
            uiSchema,
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
        enum: [CLAIMANT_TYPES.VETERAN, CLAIMANT_TYPES.NON_VETERAN],
      },
    },
  },
};
