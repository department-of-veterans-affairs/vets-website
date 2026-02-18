import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationDisputeInformation from '../../../components/confirmationFields/ConfirmationDisputeInformation';
import { DISPUTE_REASONS } from '../../../constants';

const mockFormDataWithSingleDebt = {
  selectedDebts: [
    {
      selectedDebtId: 'debt-123',
      label: 'Education Debt',
      disputeReason: DISPUTE_REASONS.AMOUNT,
      supportStatement:
        'The amount charged is incorrect based on my enrollment records.',
    },
  ],
};

const mockFormDataWithMultipleDebts = {
  selectedDebts: [
    {
      selectedDebtId: 'debt-123',
      label: 'Education Debt',
      disputeReason: DISPUTE_REASONS.AMOUNT,
      supportStatement:
        'The amount charged is incorrect based on my enrollment records.',
    },
    {
      selectedDebtId: 'debt-456',
      label: 'Disability Compensation Overpayment',
      disputeReason: DISPUTE_REASONS.EXISTENCE,
      supportStatement:
        'I have documentation showing this debt was already paid in full.',
    },
  ],
};

describe('ConfirmationDisputeInformation', () => {
  it('should render dispute information for a single debt', () => {
    const { getByText } = render(
      <ConfirmationDisputeInformation formData={mockFormDataWithSingleDebt} />,
    );

    // Check debt label as header
    getByText('Education Debt');

    // Check dispute reason
    getByText('Dispute reason');
    getByText(DISPUTE_REASONS.AMOUNT);

    // Check dispute statement
    getByText('Dispute statement');
    getByText(
      'The amount charged is incorrect based on my enrollment records.',
    );
  });

  it('should render dispute information for multiple debts', () => {
    const { getByText, getAllByText } = render(
      <ConfirmationDisputeInformation
        formData={mockFormDataWithMultipleDebts}
      />,
    );

    // Check first debt
    getByText('Education Debt');
    getByText(DISPUTE_REASONS.AMOUNT);
    getByText(
      'The amount charged is incorrect based on my enrollment records.',
    );

    // Check second debt
    getByText('Disability Compensation Overpayment');
    getByText(DISPUTE_REASONS.EXISTENCE);
    getByText(
      'I have documentation showing this debt was already paid in full.',
    );

    // Check that dispute reason and statement labels appear twice using getAllByText
    const disputeReasonElements = getAllByText('Dispute reason');
    const disputeStatementElements = getAllByText('Dispute statement');
    expect(disputeReasonElements).to.have.length(2);
    expect(disputeStatementElements).to.have.length(2);
  });

  it('should handle empty selectedDebts array', () => {
    const emptyFormData = {
      selectedDebts: [],
    };

    const { container } = render(
      <ConfirmationDisputeInformation formData={emptyFormData} />,
    );

    // Should render empty container when no debts
    expect(container.firstChild).to.be.null;
  });

  it('should render unique keys for each debt container', () => {
    const { container } = render(
      <ConfirmationDisputeInformation
        formData={mockFormDataWithMultipleDebts}
      />,
    );

    // Should have multiple debt containers
    const debtContainers = container.children;
    expect(debtContainers.length).to.equal(2);

    // Each container should have the debt label as header
    expect(debtContainers[0].querySelector('h4').textContent).to.equal(
      'Education Debt',
    );
    expect(debtContainers[1].querySelector('h4').textContent).to.equal(
      'Disability Compensation Overpayment',
    );
  });

  it('should handle long dispute statements', () => {
    const formDataWithLongStatement = {
      selectedDebts: [
        {
          selectedDebtId: 'debt-999',
          label: 'Long Statement Debt',
          disputeReason: DISPUTE_REASONS.EXISTENCE,
          supportStatement:
            'This is a very long dispute statement that contains multiple sentences and detailed explanations about why I believe this debt is incorrect. It includes references to various documents, dates, and circumstances that support my position. The statement goes on to explain the full context of the situation and provides comprehensive reasoning for the dispute.',
        },
      ],
    };

    const { getByText } = render(
      <ConfirmationDisputeInformation formData={formDataWithLongStatement} />,
    );

    getByText('Long Statement Debt');
    getByText(DISPUTE_REASONS.EXISTENCE);
    getByText(/This is a very long dispute statement/);
  });

  it('should handle debts with minimal required data', () => {
    const minimalFormData = {
      selectedDebts: [
        {
          selectedDebtId: 'minimal-debt',
          label: 'Minimal Debt',
          disputeReason: DISPUTE_REASONS.AMOUNT,
          supportStatement: 'Brief explanation.',
        },
      ],
    };

    const { getByText } = render(
      <ConfirmationDisputeInformation formData={minimalFormData} />,
    );

    getByText('Minimal Debt');
    getByText(DISPUTE_REASONS.AMOUNT);
    getByText('Brief explanation.');
  });
});
