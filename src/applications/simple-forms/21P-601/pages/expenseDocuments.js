import React from 'react';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Upload expense documents', ({ formData }) => {
      const expenses = formData?.expenses || [];
      if (expenses.length === 0) return null;

      return (
        <div>
          <p>
            You reported the following expenses. Please upload receipts or bills
            for each:
          </p>
          <va-alert status="info" uswds slim>
            <ul className="vads-u-margin-y--0">
              {expenses.map((expense, index) => {
                const provider = expense?.provider || 'Unknown provider';
                const type = expense?.expenseType || 'Expense';
                const amount = expense?.amount
                  ? `$${parseFloat(expense.amount).toFixed(2)}`
                  : '';
                return (
                  <li key={`expense-${index}`}>
                    <strong>{type}</strong> from {provider}
                    {amount && ` — ${amount}`}
                  </li>
                );
              })}
            </ul>
          </va-alert>
        </div>
      );
    }),
    veteranSupportingDocuments: fileInputMultipleUI({
      title: 'Expense documents',
      required: false,
      hint: 'Upload receipts, bills, or other proof of expenses (1KB–5MB).',
      formNumber: '21P-601',
      disallowEncryptedPdfs: true,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      maxFileSize: 1024 * 1024 * 5,
      minFileSize: 1,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSupportingDocuments: fileInputMultipleSchema(),
    },
  },
};
