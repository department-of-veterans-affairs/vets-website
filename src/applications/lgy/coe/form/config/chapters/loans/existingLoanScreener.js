import { hasExistingLoan } from '../../schemaImports';

export const schema = hasExistingLoan;

export const uiSchema = {
  vaLoanIndicator: {
    'ui:title': 'Have you ever had a VA-backed loan?',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        Y: 'Yes, I had a loan in the past or have one now.',
        N: 'No, I’ve never had a VA-backed loan.',
      },
    },
  },
};
