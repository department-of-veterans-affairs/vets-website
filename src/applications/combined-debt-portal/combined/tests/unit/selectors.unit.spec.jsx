import { expect } from 'chai';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import PropTypes from 'prop-types';
import {
  useCurrentCopay,
  useCurrentStatement,
} from '../../utils/selectors';

const createFeatureToggles = (useLighthouseCopays = false) => ({
  [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: useLighthouseCopays,
  loading: false,
});

const createMcp = (overrides = {}) => ({
  copays: [],
  isCopayDetailLoading: false,
  isCopaysLoading: false,
  ...overrides,
});

const createState = ({ useLighthouseCopays = false, mcp = {} } = {}) => ({
  combinedPortal: { mcp: createMcp(mcp) },
  featureToggles: createFeatureToggles(useLighthouseCopays),
});

const createStoreFromState = initialState =>
  createStore(
    combineReducers({
      combinedPortal: (state = initialState.combinedPortal ?? {}) => state,
      featureToggles: (
        state = initialState.featureToggles ?? { loading: false }
      ) => state,
    }),
  );

const createHookWrapper = (initialState, route, path) => {
  const store = createStoreFromState(initialState);
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Route path={path}>{children}</Route>
        </MemoryRouter>
      </Provider>
    );
  }
  Wrapper.propTypes = { children: PropTypes.node };
  return Wrapper;
};

describe('useCurrentCopay)', () => {
  const route = '/copay-balances/copay-123';
  const path = '/copay-balances/:id';

  context('when useLighthouseCopays is true', () => {
    it('returns currentCopay from selectCopayDetail', () => {
      const state = createState({
        useLighthouseCopays: true,
        mcp: {
          currentCopay: { id: 'copay-123', amount: 50 },
          isCopayDetailLoading: false,
        },
      });
      const { result } = renderHook(() => useCurrentCopay(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.currentCopay?.id).to.equal('copay-123');
      expect(result.current.isLoading).to.be.false;
    });

    it('returns isLoading from selectIsCopayDetailLoading', () => {
      const state = createState({
        useLighthouseCopays: true,
        mcp: { currentCopay: {}, isCopayDetailLoading: true },
      });
      const { result } = renderHook(() => useCurrentCopay(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.isLoading).to.be.true;
    });
  });

  context('when useLighthouseCopays is false', () => {
    it('returns currentCopay from allCopays by id', () => {
      const copays = [
        { id: 'copay-123', pSStatementDateOutput: '2024-01-01' },
        { id: 'other', pSStatementDateOutput: '2024-02-01' },
      ];
      const state = createState({
        useLighthouseCopays: false,
        mcp: { copays, isCopayDetailLoading: false },
      });
      const { result } = renderHook(() => useCurrentCopay(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.currentCopay?.id).to.equal('copay-123');
      expect(result.current.isLoading).to.be.false;
    });

    it('returns isLoading from selectIsCopayDetailLoading', () => {
      const state = createState({
        useLighthouseCopays: false,
        mcp: { currentCopay: {}, isCopayDetailLoading: true },
      });
      const { result } = renderHook(() => useCurrentCopay(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.isLoading).to.be.true;
    });
  });
});

describe('useCurrentStatement', () => {
  const route = '/copay-balances/stmt-456/statement';
  const path = '/copay-balances/:id/statement';

  context('when useLighthouseCopays is false', () => {
    it('returns statementCopays filtered by statementId from URL', () => {
      /* eslint-disable camelcase */
      const copays = [
        { id: 'a', statement_id: 'stmt-456', date: '2024-01-01' },
        { id: 'b', statement_id: 'stmt-456', date: '2024-01-02' },
        { id: 'c', statement_id: 'other-id', date: '2024-02-01' },
      ];
      /* eslint-enable camelcase */
      const state = createState({
        useLighthouseCopays: false,
        mcp: { copays, isCopaysLoading: false },
      });
      const { result } = renderHook(() => useCurrentStatement(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.statementCopays).to.have.lengthOf(2);
      expect(result.current.statementCopays[0]['statement_id']).to.equal(
        'stmt-456',
      );
      expect(result.current.isLoading).to.be.false;
    });

    it('returns empty statementCopays when no copays match statementId', () => {
      const state = createState({
        useLighthouseCopays: false,
        mcp: {
          /* eslint-disable-next-line camelcase */
          copays: [{ id: 'a', statement_id: 'other-id' }],
          isCopaysLoading: false,
        },
      });
      const { result } = renderHook(() => useCurrentStatement(), {
        wrapper: createHookWrapper(state, route, path),
      });
      expect(result.current.statementCopays).to.have.lengthOf(0);
      expect(result.current.isLoading).to.be.false;
    });
  });

  it('returns isLoading true when copays have not yet been loaded', () => {
    const state = createState({
      useLighthouseCopays: false,
      mcp: { copays: [], isCopaysLoading: true },
    });
    const { result } = renderHook(() => useCurrentStatement(), {
      wrapper: createHookWrapper(state, route, path),
    });
    expect(result.current.isLoading).to.be.true;
    expect(result.current.statementCopays).to.have.lengthOf(0);
  });
});
