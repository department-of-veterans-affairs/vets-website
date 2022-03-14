import { hasExistingLoan } from '../../schemaImports';

export const schema = hasExistingLoan;

export const uiSchema = {
  vaLoanIndicator: {
    'ui:title': 'Have you ever had a VA-backed loan?',
    'ui:widget': 'yesNo',
    'ui:options': {
      // NOTE: using yesNoReverse flips the underlying value (true/false) associated
      // with the yes/no radio buttons. Because of this, the 'yes' label is associated
      // with false and vice versa.
      labels: {
        Y: 'No, I’ve never had a VA-backed loan.',
        N: 'Yes, I had a loan in the past or have one now.',
      },
      yesNoReverse: true,
    },
  },
};
