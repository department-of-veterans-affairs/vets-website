import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import * as Sentry from '@sentry/browser';
import DisputeSummaryReview from '../../components/DisputeSummaryReview';

describe('DisputeSummaryReview Component', () => {
  let sentryStub;
  let withScopeStub;

  beforeEach(() => {
    sentryStub = sinon.stub(Sentry, 'captureMessage');
    withScopeStub = sinon.stub(Sentry, 'withScope').callsFake(callback => {
      const mockScope = {
        setLevel: sinon.stub(),
        setExtra: sinon.stub(),
      };
      callback(mockScope);
    });
  });

  afterEach(() => {
    sentryStub.restore();
    withScopeStub.restore();
  });

  it('renders without crashing', () => {
    expect(DisputeSummaryReview).to.be.a('function');
  });

  it('renders no debts message when selectedDebts is empty', () => {
    const data = { selectedDebts: [] };
    const { container } = render(<DisputeSummaryReview data={data} />);

    expect(container.textContent).to.include('No debts selected for dispute');
    expect(container.querySelector('.dispute-summary-review')).to.exist;
  });

  it('logs to Sentry when no debts are selected', () => {
    const data = { selectedDebts: [] };
    render(<DisputeSummaryReview data={data} />);

    expect(
      sentryStub.calledWith(
        'Dispute Debt - Veteran reached review page without selecting any debts',
      ),
    ).to.be.true;
  });

  it('renders debt summary when debts are selected', () => {
    const mockDebt = {
      selectedDebtId: '123',
      label: 'Test Debt',
      currentAr: 1000,
      disputeReason: 'Test reason',
      supportStatement: 'Test statement',
    };

    const data = { selectedDebts: [mockDebt] };
    const { container } = render(<DisputeSummaryReview data={data} />);

    expect(container.querySelector('.dispute-summary-content')).to.exist;
    expect(container.querySelector('.debt-summary-entry')).to.exist;
    expect(container.textContent).to.include('Test Debt');
    expect(container.textContent).to.include('Test reason');
    expect(container.textContent).to.include('Test statement');
  });

  it('renders multiple debt summaries', () => {
    const mockDebts = [
      {
        selectedDebtId: '123',
        label: 'Debt 1',
        currentAr: 1000,
        disputeReason: 'Reason 1',
      },
      {
        selectedDebtId: '456',
        label: 'Debt 2',
        currentAr: 2000,
        disputeReason: 'Reason 2',
      },
    ];

    const data = { selectedDebts: mockDebts };
    const { container } = render(<DisputeSummaryReview data={data} />);

    const debtEntries = container.querySelectorAll('.debt-summary-entry');
    expect(debtEntries).to.have.length(2);
    expect(container.textContent).to.include('Debt 1');
    expect(container.textContent).to.include('Debt 2');
  });

  it('renders navigation buttons when debts are present', () => {
    const mockDebt = {
      selectedDebtId: '123',
      label: 'Test Debt',
      currentAr: 1000,
    };

    const data = { selectedDebts: [mockDebt] };
    const { container } = render(<DisputeSummaryReview data={data} />);

    expect(container.querySelector('va-button[text="Back"]')).to.exist;
    expect(container.querySelector('va-button[text="Submit dispute"]')).to
      .exist;
  });

  it('handles debt without disputeReason gracefully', () => {
    const mockDebt = {
      selectedDebtId: '123',
      label: 'Test Debt',
      currentAr: 1000,
      // No disputeReason
    };

    const data = { selectedDebts: [mockDebt] };
    const { container } = render(<DisputeSummaryReview data={data} />);

    expect(container.querySelector('.debt-summary-entry')).to.exist;
    expect(container.textContent).to.include('Test Debt');
  });

  it('handles debt without supportStatement gracefully', () => {
    const mockDebt = {
      selectedDebtId: '123',
      label: 'Test Debt',
      currentAr: 1000,
      disputeReason: 'Test reason',
      // No supportStatement
    };

    const data = { selectedDebts: [mockDebt] };
    const { container } = render(<DisputeSummaryReview data={data} />);

    expect(container.querySelector('.debt-summary-entry')).to.exist;
    expect(container.textContent).to.include('Test Debt');
    expect(container.textContent).to.include('Test reason');
  });

  it('exports as default function', () => {
    expect(DisputeSummaryReview).to.be.a('function');
    expect(DisputeSummaryReview.name).to.equal('DisputeSummaryReview');
  });
});
