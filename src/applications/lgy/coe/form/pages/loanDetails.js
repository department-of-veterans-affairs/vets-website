import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  numberUI,
  numberSchema,
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
    dateRange: currentOrPastMonthYearDateUI({
      title: 'Loan date',
    }),
    vaLoanNumber: numberUI({
      title: 'VA loan number',
      hint: 'Enter a 12-digit loan number',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      dateRange: currentOrPastMonthYearDateSchema,
      vaLoanNumber: numberSchema,
    },
    required: ['dateRange'],
  },
};
