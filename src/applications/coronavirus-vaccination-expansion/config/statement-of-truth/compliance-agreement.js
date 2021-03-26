import {
  ifYouAgree,
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
    'ui:description': ifYouAgree,
    veteranCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicantType !== 'veteran';
        },
      },
      'ui:required': formData => {
        return formData.applicantType === 'veteran';
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthVeteran,
    },
    spouseCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicantType !== 'spouse';
        },
      },
      'ui:required': formData => {
        return formData.applicantType === 'spouse';
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthSpouse,
    },
    caregiverCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return (
            formData.applicantType !== 'caregiverEnrolled' &&
            formData.applicantType !== 'caregiverOfVeteran'
          );
        },
      },
      'ui:required': formData => {
        return (
          formData.applicantType === 'caregiverEnrolled' ||
          formData.applicantType === 'caregiverOfVeteran'
        );
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthCaregiver,
    },
    champVaRecipientCertify: {
      'ui:options': {
        hideLabelText: true,
        hideIf: formData => {
          return formData.applicantType !== 'CHAMPVA';
        },
      },
      'ui:required': formData => {
        return formData.applicantType === 'CHAMPVA';
      },
      'ui:widget': 'checkbox',
      'ui:title': statementOfTruthChampva,
    },
  },
};
