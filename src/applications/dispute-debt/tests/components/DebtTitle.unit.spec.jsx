import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import DebtTitle from '../../components/DebtTitle';

const createMockStore = formData => {
  return createStore(() => ({
    form: {
      data: formData,
    },
  }));
};

describe('DebtTitle Component', () => {
  it('should render fallback title when debt is not provided', () => {
    const store = createMockStore({ selectedDebts: [] });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include('Debt 1 of 0: Reason for dispute');
  });

  it('should render debt title with currentAr amount', () => {
    const selectedDebts = [
      {
        deductionCode: '30',
        currentAr: 1500.5,
        originalAr: 2000.0,
      },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 1 of 1: $1,500.50 for Disability compensation and pension overpayment',
    );
  });

  it('should use originalAr when currentAr is not available', () => {
    const selectedDebts = [
      {
        deductionCode: '74',
        originalAr: 2500.0,
      },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 1 of 1: $2,500.00 for Post-9/11 GI Bill overpayment for tuition',
    );
  });

  it('should show $0.00 when no amount is available', () => {
    const selectedDebts = [
      {
        deductionCode: '41',
      },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 1 of 1: $0.00 for Chapter 34 education overpayment',
    );
  });

  it('should handle unknown deduction codes', () => {
    const selectedDebts = [
      {
        deductionCode: '999',
        currentAr: 100,
      },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 1 of 1: $100.00 for VA debt',
    );
  });

  it('should handle null deduction codes', () => {
    const selectedDebts = [
      {
        deductionCode: null,
        currentAr: 500.75,
      },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 0 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 1 of 1: $500.75 for VA debt',
    );
  });

  it('should handle multiple debts with correct indexing', () => {
    const selectedDebts = [
      { deductionCode: '30', currentAr: 1000 },
      { deductionCode: '41', currentAr: 2000 },
      { deductionCode: '74', currentAr: 3000 },
    ];
    const store = createMockStore({ selectedDebts });
    const formContext = { pagePerItemIndex: 1 };

    const { container } = render(
      <Provider store={store}>
        <DebtTitle formContext={formContext} />
      </Provider>,
    );

    expect(container.textContent).to.include(
      'Debt 2 of 3: $2,000.00 for Chapter 34 education overpayment',
    );
  });
});
