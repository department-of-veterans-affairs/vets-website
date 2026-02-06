import React from 'react';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Upload debt documents', ({ formData }) => {
      const debts = formData?.otherDebts || [];
      if (debts.length === 0) return null;

      return (
        <div>
          <p>
            You reported the following debts. Please upload documentation for
            each:
          </p>
          <va-alert status="info" uswds slim>
            <ul className="vads-u-margin-y--0">
              {debts.map((debt, index) => {
                const type = debt?.debtType || 'Debt';
                const amount = debt?.debtAmount
                  ? `$${parseFloat(debt.debtAmount).toFixed(2)}`
                  : '';
                const creditor = debt?.creditorName;
                return (
                  <li key={`debt-${index}`}>
                    <strong>{type}</strong>
                    {creditor && ` owed to ${creditor}`}
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
      title: 'Debt documents',
      required: false,
      hint: 'Upload statements, invoices, or other proof of debts (1KB–5MB).',
      formNumber: '21P-601',
      disallowEncryptedPdfs: true,
      fileUploadUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
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
