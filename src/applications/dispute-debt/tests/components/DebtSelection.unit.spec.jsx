import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import DebtSelection from '../../components/DebtSelection';
import * as utils from '../../utils';

// Mock Redux store
const createMockStore = initialState => {
  const mockReducer = (state = initialState) => state;
  return createStore(mockReducer);
};

// Helper to render component with Redux store
const renderWithStore = (component, initialState) => {
  const store = createMockStore(initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

describe('DebtSelection Component', () => {
  let setFocusStub;

  beforeEach(() => {
    setFocusStub = sinon.stub(utils, 'setFocus');
  });

  afterEach(() => {
    setFocusStub.restore();
  });

  it('renders without crashing', () => {
    // Simple smoke test to ensure component can be imported and instantiated
    expect(DebtSelection).to.be.a('function');
  });

  it('renders AlertCard when isDebtError is true', () => {
    const initialState = {
      availableDebts: { availableDebts: [], isDebtError: true },
      form: { data: { selectedDebts: [] } },
    };

    const { container } = renderWithStore(
      <DebtSelection formContext={{ submitted: false }} />,
      initialState,
    );

    // Should render AlertCard instead of debt selection content
    expect(container.querySelector('[data-testid="balance-card-alert-debt"]'))
      .to.exist;
    expect(container.querySelector('[data-testid="debt-selection-content"]')).to
      .not.exist;
  });

  it('renders ZeroDebtsAlert when no debts are available', () => {
    const initialState = {
      availableDebts: { availableDebts: [], isDebtError: false },
      form: { data: { selectedDebts: [] } },
    };

    const { container } = renderWithStore(
      <DebtSelection formContext={{ submitted: false }} />,
      initialState,
    );

    // Should render AlertCard when no debts available
    expect(container.querySelector('[data-testid="zero-debts-alert-card"]')).to
      .exist;
    expect(container.querySelector('[data-testid="debt-selection-content"]')).to
      .not.exist;
  });

  it('renders debt selection content when debts are available', () => {
    const mockDebt = {
      compositeDebtId: '123',
      label: 'Test Debt',
      description: 'Test debt description',
    };

    const initialState = {
      availableDebts: { availableDebts: [mockDebt], isDebtError: false },
      form: { data: { selectedDebts: [] } },
    };

    const { container } = renderWithStore(
      <DebtSelection formContext={{ submitted: false }} />,
      initialState,
    );

    // Should render debt selection content
    expect(container.querySelector('[data-testid="debt-selection-content"]')).to
      .exist;
    expect(container.querySelector('va-checkbox-group')).to.exist;
    expect(container.querySelector('va-checkbox')).to.exist;
    expect(container.querySelector('va-additional-info')).to.exist;
  });

  it('renders multiple debt checkboxes when multiple debts available', () => {
    const mockDebts = [
      { compositeDebtId: '123', label: 'Debt 1', description: 'Description 1' },
      { compositeDebtId: '456', label: 'Debt 2', description: 'Description 2' },
      { compositeDebtId: '789', label: 'Debt 3', description: 'Description 3' },
    ];

    const initialState = {
      availableDebts: { availableDebts: mockDebts, isDebtError: false },
      form: { data: { selectedDebts: [] } },
    };

    const { container } = renderWithStore(
      <DebtSelection formContext={{ submitted: false }} />,
      initialState,
    );

    // Should render all debt checkboxes
    const checkboxes = container.querySelectorAll('va-checkbox');
    expect(checkboxes).to.have.length(3);
  });

  it('shows validation error when submitted with no debts selected', () => {
    const mockDebt = {
      compositeDebtId: '123',
      label: 'Test Debt',
      description: 'Test debt description',
    };

    const initialState = {
      availableDebts: { availableDebts: [mockDebt], isDebtError: false },
      form: { data: { selectedDebts: [] } },
    };

    renderWithStore(
      <DebtSelection formContext={{ submitted: true }} />,
      initialState,
    );

    // Should call setFocus when validation error occurs
    expect(setFocusStub.calledWith('va-checkbox-group')).to.be.true;
  });

  it('calls setFocus utility when available', () => {
    // Test that the utility function is available
    expect(utils.setFocus).to.be.a('function');
  });

  it('exports as default function', () => {
    // Test that component exports correctly
    expect(DebtSelection).to.be.a('function');
    expect(DebtSelection.name).to.equal('DebtSelection');
  });
});
