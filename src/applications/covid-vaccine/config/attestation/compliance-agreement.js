export const schema = {
  complianceAgreement: {
    type: 'object',
    properties: {
      iCertify: {
        type: 'boolean',
        label: 'derp',
        description: 'derpty',
      },
      iUnderstand: {
        type: 'boolean',
        label: 'derp',
        description: 'derpty',
      },
    },
  },
};

export const uiSchema = {
  complianceAgreement: {
    'ui:title': 'Statement of truth',
    iCertify: {
      'ui:options': {
        hideLabelText: true,
      },
      'ui:widget': 'checkbox',
    },
    iUnderstand: {
      'ui:options': {
        hideLabelText: true,
      },
      'ui:widget': 'checkbox',
    },
  },
};
