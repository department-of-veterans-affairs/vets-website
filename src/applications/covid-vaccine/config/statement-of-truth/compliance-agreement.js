import { statementOfTruth } from './helpers';

export const schema = {
  complianceAgreement: {
    type: 'object',
    properties: {
      iCertify: {
        type: 'boolean',
      },
    },
  },
};

export const uiSchema = {
  complianceAgreement: {
    'ui:title': 'Statement of truth',
    'ui:description':
      'If you understand and agree with these statements, please check the box:',
    iCertify: {
      'ui:options': {
        hideLabelText: true,
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruth,
    },
  },
};
