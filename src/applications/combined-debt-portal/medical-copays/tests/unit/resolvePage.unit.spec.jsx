import { expect } from 'chai';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import ResolvePage from '../../containers/ResolvePage';

const renderWithStore = (component, initialState) => {
  const rootReducer = combineReducers({
    combinedPortal: (state = initialState.combinedPortal, action) => {
      if (action.type === 'GET_COPAY_DETAIL_STATEMENT_REQUEST') {
        return {
          ...state,
          mcp: {
            ...state.mcp,
            isCopayDetailLoading: true,
          },
        };
      }
      if (action.type === 'GET_COPAY_DETAIL_STATEMENT_SUCCESS') {
        return {
          ...state,
          mcp: {
            ...state.mcp,
            selectedStatement: action.payload,
            isCopayDetailLoading: false,
          },
        };
      }
      return state;
    },
    user: (state = initialState.user) => state,
    featureToggles: (
      state = initialState.featureToggles || { loading: false },
    ) => state,
  });

  const store = createStore(rootReducer, applyMiddleware(thunk));
  const dispatchSpy = sinon.spy(store, 'dispatch');

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
    dispatchSpy,
  };
};

describe('Resolve Page Tests', () => {
  const initialState = {
    combinedPortal: {
      mcp: {
        selectedStatement: {},
        isCopayDetailLoading: false,
        statements: [],
      },
      debtLetters: { debts: [], errors: [] },
    },
    user: {
      profile: {
        userFullName: { first: 'Jane', last: 'Doe' },
      },
    },
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
    },
  };

  describe('ResolvePage', () => {
    const match = { params: { id: '4-1abZUKu7xIvIw6' } };

    it('dispatches getCopayDetailStatement exactly once', async () => {
      const { dispatchSpy } = renderWithStore(
        <ResolvePage match={match} />,
        initialState,
      );

      await waitFor(() => {
        // Check that dispatch was called with a thunk (function)
        const thunkCalls = dispatchSpy
          .getCalls()
          .filter(call => typeof call.args[0] === 'function');
        expect(thunkCalls.length).to.equal(1);
      });
    });
  });
});
