import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  numberSchema,
  numberUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { PropertyAddress } from '../components/PropertyAddress';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Property with VA home loan: Existing VA home loan details',
      ({ formData }) => (
        <div>
          <p>Provide VA home loan information for this property.</p>
          <PropertyAddress formData={formData} />
        </div>
      ),
    ),
    loanDate: currentOrPastMonthYearDateUI({
      title: 'Loan date',
    }),
    vaLoanNumber: {
      ...numberUI({
        title: 'VA loan number',
        hint: 'Enter a 12-digit loan number',
        errorMessages: {
          max: 'Make sure you include 12 digits.',
          pattern: 'Enter numbers only',
        },
      }),
      'ui:validations': [
        (errors, formData, uiSchema, schema, errorMessages) => {
          if (!formData) return;
          if (!/^[0-9]*$/.test(formData)) {
            errors.addError(errorMessages?.pattern);
            return;
          }
          if (formData.length !== 12) {
            errors.addError(errorMessages?.max);
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      loanDate: currentOrPastMonthYearDateSchema,
      vaLoanNumber: numberSchema,
    },
    required: ['loanDate'],
  },
};
