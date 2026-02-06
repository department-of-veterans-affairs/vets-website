import React from 'react';
import environment from 'platform/utilities/environment';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Submit supporting documents', ({ formData }) => {
      const expenses = formData?.expenses || [];
      const debts = formData?.otherDebts || [];
      const hasExpenses = expenses.length > 0;
      const hasDebts = debts.length > 0;

      if (!hasExpenses && !hasDebts) {
        return 'This may include legal documents, bills, or other documentation of expenses.';
      }

      return (
        <div>
          <p>
            Based on what you've reported, please upload the following
            supporting documents:
          </p>
          {hasExpenses && (
            <va-alert
              status="info"
              uswds
              slim
              className="vads-u-margin-bottom--2"
            >
              <p className="vads-u-margin-top--0">
                <strong>
                  Expense documents ({expenses.length} expense
                  {expenses.length > 1 ? 's' : ''} reported):
                </strong>
              </p>
              <ul className="vads-u-margin-bottom--0">
                {expenses.map((expense, i) => {
                  const provider = expense?.provider || 'Unknown provider';
                  const type = expense?.expenseType || 'Expense';
                  const amount = expense?.amount
                    ? `$${parseFloat(expense.amount).toFixed(2)}`
                    : '';
                  return (
                    <li key={`exp-msg-${i}`}>
                      {type} from {provider}
                      {amount && ` — ${amount}`}
                    </li>
                  );
                })}
              </ul>
            </va-alert>
          )}
          {hasDebts && (
            <va-alert status="info" uswds slim>
              <p className="vads-u-margin-top--0">
                <strong>
                  Debt documents ({debts.length} debt
                  {debts.length > 1 ? 's' : ''} reported):
                </strong>
              </p>
              <ul className="vads-u-margin-bottom--0">
                {debts.map((debt, i) => {
                  const type = debt?.debtType || 'Debt';
                  const amount = debt?.debtAmount
                    ? `$${parseFloat(debt.debtAmount).toFixed(2)}`
                    : '';
                  const creditor = debt?.creditorName;
                  return (
                    <li key={`debt-msg-${i}`}>
                      {type}
                      {creditor && ` owed to ${creditor}`}
                      {amount && ` — ${amount}`}
                    </li>
                  );
                })}
              </ul>
            </va-alert>
          )}
        </div>
      );
    }),
    veteranSupportingDocuments: fileInputMultipleUI({
      title: 'Supporting documents',
      required: false,
      hint: 'Upload a file that is between 1KB and 5MB.',
      formNumber: '21P-601',
      disallowEncryptedPdfs: true,
      fileUploadUrl: `${
        environment.API_URL
      }/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      maxFileSize: 1024 * 1024 * 5,
      minFileSize: 1,
      additionalInputRequired: true,
      additionalInput: (error, data) => {
        const { documentCategory } = data || {};
        return (
          <VaSelect
            required
            error={error}
            value={documentCategory}
            label="What type of document is this?"
          >
            <option value="">-- Select a document type --</option>
            <option value="funeral">Funeral service receipt</option>
            <option value="burial">Burial expense receipt</option>
            <option value="hospital">Hospital bill</option>
            <option value="doctor">Doctor bill</option>
            <option value="other_medical">Other medical expense</option>
            <option value="debt">Debt documentation</option>
            <option value="other">Other supporting document</option>
          </VaSelect>
        );
      },
      // eslint-disable-next-line no-param-reassign
      additionalInputUpdate: (instance, error, data) => {
        instance.setAttribute('error', error || '');
        if (data) {
          instance.value = data.documentCategory || ''; // eslint-disable-line no-param-reassign
        }
      },
      handleAdditionalInput: e => {
        return { documentCategory: e.detail.value };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSupportingDocuments: fileInputMultipleSchema(),
    },
  },
};
