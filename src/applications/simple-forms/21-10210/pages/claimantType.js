import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

export default {
  uiSchema: {
    claimantType: radioUI({
      labelHeaderLevel: '2',
      labelHeaderLevelStyle: '3',
      hideIf: formData => formData.claimOwnership === undefined,
      labels: {
        [CLAIMANT_TYPES.VETERAN]: 'Veteran',
        [CLAIMANT_TYPES.NON_VETERAN]: 'Non-Veteran',
      },
      updateSchema: (formData, schema, uiSchema) => {
        const { claimOwnership } = formData;
        let labels = {
          [CLAIMANT_TYPES.VETERAN]: 'Veteran',
          [CLAIMANT_TYPES.NON_VETERAN]: 'Non-Veteran',
        };
        let title;

        switch (claimOwnership) {
          case CLAIM_OWNERSHIPS.SELF:
            title = 'Are you a Veteran?';
            labels = {
              [CLAIMANT_TYPES.VETERAN]: 'Yes',
              [CLAIMANT_TYPES.NON_VETERAN]: 'No',
            };
            break;
          case CLAIM_OWNERSHIPS.THIRD_PARTY:
            title =
              "Is the person you're submitting this statement for a Veteran?";
            labels = {
              [CLAIMANT_TYPES.VETERAN]: 'Yes',
              [CLAIMANT_TYPES.NON_VETERAN]: 'No',
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
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      claimantType: radioSchema([
        CLAIMANT_TYPES.VETERAN,
        CLAIMANT_TYPES.NON_VETERAN,
      ]),
    },
  },
};
