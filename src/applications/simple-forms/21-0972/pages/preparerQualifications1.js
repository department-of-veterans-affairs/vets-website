import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: use groupcheckbox once shared one is available
    preparerQualifications: {
      'ui:title': 'stuff',
      'ui:webComponentField': VaRadioField,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          courtAppointedRep: 'Court-appointed representative',
          attorney: 'Attorney in fact or agent',
          caregiver: 'Caregiver',
          manager: 'Manager or Principal Officer',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      preparerQualifications: {
        type: 'string',
        enum: ['courtAppointedRep', 'attorney', 'caregiver', 'manager'],
      },
    },
    required: ['preparerQualifications'],
  },
};
