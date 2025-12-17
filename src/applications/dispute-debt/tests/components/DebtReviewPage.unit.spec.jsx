import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import DebtReviewPage from '../../components/DebtReviewPage';

describe('DebtReviewPage Component', () => {
  const mockEditPage = () => {};

  it('should render fallback title when debt is not provided', () => {
    const props = {
      data: { selectedDebts: [] },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include('Debt 1 of 0');
  });

  it('should render debt title with currentAr amount', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '30',
            currentAr: 1500.5,
            originalAr: 2000.0,
            disputeReason: 'I disagree with this debt',
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include(
      'Debt 1 of 1: $1,500.50 for Disability compensation and pension overpayment',
    );
    expect(container.textContent).to.include('I disagree with this debt');
  });

  it('should use originalAr when currentAr is not available', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '74',
            originalAr: 2500.0,
            supportStatement: 'This is my support statement',
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include(
      'Debt 1 of 1: $2,500.00 for Post-9/11 GI Bill overpayment for tuition',
    );
    expect(container.textContent).to.include('This is my support statement');
  });

  it('should show $0.00 when no amount is available', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '41',
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include(
      'Debt 1 of 1: $0.00 for Chapter 34 education overpayment',
    );
  });

  it('should handle unknown deduction codes', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '999',
            currentAr: 100,
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include(
      'Debt 1 of 1: $100.00 for VA debt',
    );
  });

  it('should handle multiple debts with correct indexing', () => {
    const props = {
      data: {
        selectedDebts: [
          { deductionCode: '30', currentAr: 1000 },
          { deductionCode: '41', currentAr: 2000 },
          { deductionCode: '74', currentAr: 3000 },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 1,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include(
      'Debt 2 of 3: $2,000.00 for Chapter 34 education overpayment',
    );
  });

  it('should show both dispute reason and support statement fields when both exist', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '30',
            currentAr: 1000,
            disputeReason: 'Test dispute reason',
            supportStatement: 'Test support statement',
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'supportStatement',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.include('Reason for dispute');
    expect(container.textContent).to.include('Test dispute reason');
    expect(container.textContent).to.include('disputing this debt');
    expect(container.textContent).to.include('Test support statement');
  });

  it('should return null when name includes disputeReason', () => {
    const props = {
      data: {
        selectedDebts: [
          {
            deductionCode: '30',
            currentAr: 1000,
            disputeReason: 'Test dispute reason',
            supportStatement: 'Test support statement',
          },
        ],
      },
      editPage: mockEditPage,
      pagePerItemIndex: 0,
      name: 'disputeReason',
    };

    const { container } = render(<DebtReviewPage {...props} />);

    expect(container.textContent).to.equal('');
  });
});
