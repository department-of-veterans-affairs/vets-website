import React from 'react';

import { CLAIMANT_TYPES, CLAIM_OWNERSHIPS } from '../definitions/constants';

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
            case CLAIM_OWNERSHIPS.SELF:
              title = (
                <span className="vads-u-font-family--serif vads-u-font-size--h3">
                  Which of these descriptions best describes you?
                </span>
              );
              uiSchemaCopy['ui:options'].labels = {
                veteran: 'I’m a Veteran',
                'non-veteran': 'I’m a non-Veteran claimant',
              };
              break;
            case CLAIM_OWNERSHIPS.THIRD_PARTY:
              title = (
                <span className="vads-u-font-family--serif vads-u-font-size--h3">
                  Which of these individuals are you submitting a statement for?
                </span>
              );
              uiSchemaCopy['ui:options'].labels = {
                veteran: 'A Veteran',
                'non-veteran': 'A non-Veteran claimant',
              };
              break;
            default:
              title = (
                <span className="vads-u-font-family--serif vads-u-font-size--h3">
                  Claimant type:
                </span>
              );
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
        enum: [CLAIMANT_TYPES.VETERAN, CLAIMANT_TYPES.NON_VETERAN],
      },
    },
  },
};
