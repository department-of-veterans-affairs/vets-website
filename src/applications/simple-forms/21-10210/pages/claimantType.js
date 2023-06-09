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
              title = 'Are you a Veteran?';
              labels = {
                veteran: 'Yes',
                'non-veteran': 'No',
              };
              break;
            case CLAIM_OWNERSHIPS.THIRD_PARTY:
              title =
                'Is the person you’re submitting this statement for a Veteran?';
              labels = {
                veteran: 'Yes',
                'non-veteran': 'No',
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
