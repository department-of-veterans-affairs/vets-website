import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import ResolvePage from '../../containers/ResolvePage';

describe('ResolvePage', () => {
  const renderWithStore = (component, initialState) => {
    const store = createStore(
      combineReducers({
        combinedPortal: (state = initialState.combinedPortal || {}) => state,
        user: (state = initialState.user || {}) => state,
        featureToggles: (
          state = initialState.featureToggles || { loading: false },
        ) => state,
      }),
    );

    return render(<Provider store={store}>{component}</Provider>);
  };

  const mockMatch = { params: { id: '123' } };

  const mockStatement = {
    id: '123',
    attributes: {
      facility: { name: 'James A. Haley Veterans Hospital' },
      invoiceDate: '2024-01-15',
      accountNumber: 'ACC123',
      lineItems: [],
      principalBalance: 150.25,
    },
    station: {
      facilityName: 'James A. Haley Veterans Hospital',
    },
  };

  const baseState = {
    user: {
      profile: {
        userFullName: { first: 'Jane', last: 'Doe' },
      },
    },
    combinedPortal: {
      mcp: {
        selectedStatement: mockStatement,
        isCopayDetailLoading: false,
        statements: [mockStatement],
      },
    },
    featureToggles: {
      [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
      loading: false,
    },
  };

  it('renders the page title', () => {
    const { getByTestId } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      baseState,
    );

    expect(getByTestId('resolve-page-title').textContent).to.equal(
      'Resolve your copay',
    );
  });

  it('renders the facility name in the intro text', () => {
    const { container } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      baseState,
    );

    expect(container.textContent).to.include(
      'James A. Haley Veterans Hospital',
    );
  });

  it('shows loading indicator when isCopayDetailLoading is true', () => {
    const loadingState = {
      ...baseState,
      combinedPortal: {
        mcp: {
          ...baseState.combinedPortal.mcp,
          isCopayDetailLoading: true,
        },
      },
    };

    const { container } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      loadingState,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
  });

  it('does not show loading indicator when data is loaded', () => {
    const { container } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      baseState,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.not.exist;
  });

  it('displays the facility name from attributes.facility when VHA payment history flag is true', () => {
    const vhaStatement = {
      id: '123',
      attributes: {
        facility: { name: 'Orlando VA Medical Center' },
        invoiceDate: '2024-03-01',
        accountNumber: 'ACC789',
        lineItems: [],
        principalBalance: 200.5,
      },
    };

    const vhaState = {
      ...baseState,
      combinedPortal: {
        mcp: {
          selectedStatement: vhaStatement,
          isCopayDetailLoading: false,
          statements: [vhaStatement],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        loading: false,
      },
    };

    const { container } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      vhaState,
    );

    expect(container.textContent).to.include('Orlando VA Medical Center');
  });

  it('displays the facility name from station when VHA payment history flag is false', () => {
    const legacyStatement = {
      id: '123',
      station: {
        facilityName: 'Tampa VA Medical Center',
      },
      pSStatementDateOutput: '01/15/2024',
      accountNumber: 'ACC456',
      details: [],
    };

    const legacyState = {
      ...baseState,
      combinedPortal: {
        mcp: {
          selectedStatement: legacyStatement,
          isCopayDetailLoading: false,
          statements: [legacyStatement],
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        loading: false,
      },
    };

    const { container } = renderWithStore(
      <ResolvePage match={mockMatch} />,
      legacyState,
    );

    expect(container.textContent).to.include('Tampa VA Medical Center');
  });
});
