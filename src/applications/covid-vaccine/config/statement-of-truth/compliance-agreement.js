import {
  statementOfTruthVeteran,
  statementOfTruthSpouse,
  statementOfTruthCaregiver,
  statementOfTruthChampva,
} from './helpers';

export const schema = {
  complianceAgreement: {
    type: 'object',
    properties: {
      veteranCertify: {
        type: 'boolean',
      },
      spouseCertify: {
        type: 'boolean',
      },
      caregiverCertify: {
        type: 'boolean',
      },
      champVaRecipientCertify: {
        type: 'boolean',
      },
    },
  },
};

// TODO conditional require the one that will be shown.

export const uiSchema = {
  complianceAgreement: {
    'ui:title': 'Statement of truth',
    'ui:description':
      'If you understand and agree with these statements, please check the box:',
    veteranCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicatntType !== 'veteran';
        },
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthVeteran,
    },
    spouseCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicatntType !== 'spouse';
        },
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthSpouse,
    },
    caregiverCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return (
            formData.applicatntType !== 'caregiverEnrolled' &&
            formData.applicatntType !== 'caregiverOfVeteran'
          );
        },
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthCaregiver,
    },
    champVaRecipientCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicatntType !== 'CHAMPVA';
        },
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthChampva,
    },
  },
};
