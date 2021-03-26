import { complianceAgreement } from '../schema-imports';
import {
  ifYouAgree,
  statementOfTruthVeteran,
  statementOfTruthSpouse,
  statementOfTruthCaregiver,
  statementOfTruthChampva,
} from './helpers';

export const schema = {
  complianceAgreement,
};

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
