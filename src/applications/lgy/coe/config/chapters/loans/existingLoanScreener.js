import { hasExistingLoan } from '../../schemaImports';

export const schema = hasExistingLoan;

export const uiSchema = {
  existingLoan: {
    'ui:title': 'Have you ever had a VA backed loan?',
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        N: 'No, I’ve never had a VA-backed loan',
        Y: 'Yes, I had a loan in the past, or have one now',
      },
    },
  },
};
