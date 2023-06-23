import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: use groupcheckbox once shared one is available
    preparerSigningReason: {
      'ui:title': 'stuff',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          under18: 'They’re under 18 years old.',
          mentallyIncapable:
            'They don’t have the mental capacity to provide all the information needed for the form or to certify that the statements on the form are true and complete.',
          physicallyIncapable: 'They can’t physically sign the forms.',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerSigningReason: {
        type: 'string',
        enum: ['under18', 'mentallyIncapable', 'physicallyIncapable'],
      },
    },
    required: ['preparerSigningReason'],
  },
};
