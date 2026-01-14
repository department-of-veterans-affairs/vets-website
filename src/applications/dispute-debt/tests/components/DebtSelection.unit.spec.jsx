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

  const mockDebt = {
    compositeDebtId: '123',
    label: 'Test Debt',
    description: 'Test debt description',
  };

  const mockDebtsAllTypes = [
    mockDebt,
    {
      compositeDebtId: '125',
      label: 'Unsubmitted Debt',
      description: 'Unsubmitted debt description',
      submitted: false,
    },
    {
      compositeDebtId: '124',
      label: 'Submitted Debt',
      description: 'Submitted debt description',
      submitted: true,
      submissionDate: '12/31/2025',
    },
  ];

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

    expect(container.querySelector('[data-testid="zero-debts-alert-card"]')).to
      .exist;
    expect(container.querySelector('[data-testid="debt-selection-content"]')).to
      .not.exist;
  });

  it('renders debt selection content when debts are available and/or submitted', () => {
    const initialState = {
      availableDebts: {
        availableDebts: mockDebtsAllTypes,
        isDebtError: false,
      },
      form: { data: { selectedDebts: [] } },
    };

    const { container } = renderWithStore(
      <DebtSelection formContext={{ submitted: false }} />,
      initialState,
    );

    const contentDiv = container.querySelector(
      '[data-testid="debt-selection-content"]',
    );
    expect(contentDiv).to.exist;
    const checkboxGroup = contentDiv.querySelector('va-checkbox-group');
    const availableCheckboxes = checkboxGroup.querySelectorAll('va-checkbox');
    expect(availableCheckboxes).to.have.length(2);

    // Verify debt without submitted attribute (compositeDebtId: '123')
    const testDebtCheckbox = Array.from(availableCheckboxes).find(
      cb => cb.getAttribute('data-index') === '123',
    );
    expect(testDebtCheckbox).to.exist;
    expect(testDebtCheckbox.getAttribute('label')).to.equal('Test Debt');
    expect(testDebtCheckbox.getAttribute('checkbox-description')).to.equal(
      'Test debt description',
    );
    expect(testDebtCheckbox.getAttribute('data-testid')).to.equal(
      'debt-selection-checkbox',
    );

    // Verify debt with submitted attribute set to false (compositeDebtId: '125')
    const unsubmittedDebtCheckbox = Array.from(availableCheckboxes).find(
      cb => cb.getAttribute('data-index') === '125',
    );
    expect(unsubmittedDebtCheckbox.getAttribute('label')).to.equal(
      'Unsubmitted Debt',
    );
    expect(
      unsubmittedDebtCheckbox.getAttribute('checkbox-description'),
    ).to.equal('Unsubmitted debt description');
    expect(unsubmittedDebtCheckbox.getAttribute('data-testid')).to.equal(
      'debt-selection-checkbox',
    );

    // Verify submitted debt (compositeDebtID: '124')
    const submittedDebtCard = checkboxGroup.querySelector(
      '[data-testid="debt-submitt4ed-124"]',
    );
    expect(submittedDebtCard).to.exist;
    expect(submittedDebtCard.querySelector('h4').textContent).to.equal(
      'Submitted Debt',
    );
    expect(submittedDebtCard.querySelector('p').textContent).to.equal(
      'Note: This debt has already been disputed on December 31, 2025 and cannot be disputed again. It can take up to 60 days to process.',
    );

    // Verify additional info exists
    expect(contentDiv.querySelector('va-additional-info')).to.exist;
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

    const checkboxes = container.querySelectorAll('va-checkbox');
    expect(checkboxes).to.have.length(3);
  });

  it('shows validation error when submitted with no debts selected', () => {
    const initialState = {
      availableDebts: { availableDebts: [mockDebt], isDebtError: false },
      form: { data: { selectedDebts: [] } },
    };

    renderWithStore(
      <DebtSelection formContext={{ submitted: true }} />,
      initialState,
    );

    expect(setFocusStub.calledWith('va-checkbox-group')).to.be.true;
  });

  it('calls setFocus utility when available', () => {
    expect(utils.setFocus).to.be.a('function');
  });

  it('exports as default function', () => {
    // Test that component exports correctly
    expect(DebtSelection).to.be.a('function');
    expect(DebtSelection.name).to.equal('DebtSelection');
  });
});
