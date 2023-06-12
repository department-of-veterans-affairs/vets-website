import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    substituteStatus: {
      'ui:title':
        'Is the deceased claimant a Veteran or another substitute claimant?',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          veteran: 'Veteran',
          substituteClaimant: 'SubstituteClaimant',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      substituteStatus: {
        type: 'string',
        enum: ['veteran', 'substituteClaimant'],
      },
    },
    required: ['substituteStatus'],
  },
};
