import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import DetailCopayPage from '../../containers/DetailCopayPage';

describe('DetailCopayPage TITLE', () => {
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
    return render(
      <Provider store={store}>
        <Router>{component}</Router>
      </Provider>,
    );
  };

  const mockMatch = { params: { id: '123' } };

  it('should use attributes.facility for TITLE when flag is true', () => {
    const mockStatement = {
      id: '123',
      attributes: {
        facility: 'James A. Haley',
        invoiceDate: '2024-01-15',
        accountNumber: 'ACC123',
        statementDate: '2024-01-15',
        lineItems: [
          {
            datePosted: '2024-01-10',
            description: 'Test Service',
            billingReference: 'REF123',
            priceComponents: [{ amount: 25 }],
            providerName: 'Test Provider',
          },
        ],
        principalBalance: 100,
        paymentDueDate: '2024-02-15',
        principalPaid: 25,
        veteranName: 'John Doe',
        veteranAddress: {
          street: '456 Patient St',
          city: 'Tampa',
          state: 'FL',
          postalCode: '33333',
        },
        facilityAddress: {
          street: '123 Main St',
          city: 'Tampa',
          state: 'FL',
          postalCode: '33333',
        },
      },
      station: {
        facilityName: 'James A. Haley',
        staTAddress1: '123 Main St',
        city: 'Tampa',
        state: 'FL',
        ziPCde: '33333',
      },
      pHAddress1: '456 Patient St',
      pHCity: 'Tampa',
      pHState: 'FL',
      pHZipCde: '33333',
      statementStartDate: '2024-01-01',
      statementEndDate: '2024-01-31',
    };

    const mockState = {
      user: {
        profile: {
          userFullName: { first: 'John', last: 'Doe' },
        },
      },
      combinedPortal: {
        mcp: {
          selectedStatement: mockStatement,
          statements: [mockStatement],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        combined_debt_portal_vha_payment_history: true,
        loading: false,
      },
    };

    const { container } = renderWithStore(
      <DetailCopayPage match={mockMatch} />,
      mockState,
    );
    expect(container.textContent).to.include('Copay bill for James A. Haley');
  });

  it('should use station.facilityName for TITLE when flag is false', () => {
    const mockStatement = {
      id: '123',
      station: {
        facilityName: 'Tampa VA Medical Center',
        staTAddress1: '123 Main St',
        city: 'Tampa',
        state: 'FL',
        ziPCde: '33333',
      },
      pSStatementDateOutput: '01/15/2024',
      pSStatementDate: '01/15/2024',
      accountNumber: 'ACC123',
      pHAccountNumber: 'ACC123',
      details: [
        {
          pDTransDescOutput: 'Test',
          pDRefNo: '123',
          pDTransAmt: 10.0,
          pDTransAmtOutput: '10.00',
        },
      ],
      pHNewBalance: 100,
      pHTotCharges: 25,
      pHAddress1: '456 Patient St',
      pHCity: 'Tampa',
      pHState: 'FL',
      pHZipCde: '33333',
    };

    const mockState = {
      user: {
        profile: {
          userFullName: { first: 'John', last: 'Doe' },
        },
      },
      combinedPortal: {
        mcp: {
          selectedStatement: mockStatement,
          statements: [mockStatement],
        },
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        combined_debt_portal_vha_payment_history: false,
        loading: false,
      },
    };

    const { container } = renderWithStore(
      <DetailCopayPage match={mockMatch} />,
      mockState,
    );
    expect(container.textContent).to.include(
      'Copay bill for Tampa VA Medical Center',
    );
  });
});
