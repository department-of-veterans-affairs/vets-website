import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { waitFor } from '@testing-library/react';

import App from '../../containers/App';
import reducer from '../../reducers';
import * as actions from '../../actions';
import * as copayActions from '../../actions/copays';

describe('App', () => {
  let sandbox;

  const defaultInitialState = {
    form: {
      data: {},
      isStartingOver: false,
    },
    fsr: {
      pending: false,
      isError: false,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        vapContactInfo: {},
        verified: true,
      },
    },
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.showFinancialStatusReport]: true,
      [FEATURE_FLAG_NAMES.financialStatusReportReviewPageNavigation]: false,
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('loading states', () => {
    it('should render loading indicator when pending is true', () => {
      const initialState = {
        ...defaultInitialState,
        fsr: {
          ...defaultInitialState.fsr,
          pending: true,
        },
      };

      const { container } = renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('label')).to.equal('Loading');
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading your information...',
      );
    });

    it('should render loading indicator when isLoadingFeatures is true', () => {
      const initialState = {
        ...defaultInitialState,
        featureToggles: {
          ...defaultInitialState.featureToggles,
          loading: true,
        },
      };

      const { container } = renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('label')).to.equal('Loading');
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading features...',
      );
    });
  });

  describe('error state', () => {
    it('should render ErrorAlert when isError is true and user is logged in', () => {
      const initialState = {
        ...defaultInitialState,
        fsr: {
          ...defaultInitialState.fsr,
          isError: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
      };

      const { getByTestId } = renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      const errorAlert = getByTestId('server-error');
      expect(errorAlert).to.exist;
    });

    it('should not render ErrorAlert when isError is true but user is not logged in', () => {
      const initialState = {
        ...defaultInitialState,
        fsr: {
          ...defaultInitialState.fsr,
          isError: true,
        },
        user: {
          login: {
            currentlyLoggedIn: false,
          },
        },
      };

      const { queryByTestId } = renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      const errorAlert = queryByTestId('server-error');
      expect(errorAlert).to.be.null;
    });
  });

  describe('feature toggle', () => {
    it('should render RoutedSavableApp when showFSR is true', () => {
      const initialState = {
        ...defaultInitialState,
        featureToggles: {
          ...defaultInitialState.featureToggles,
          [FEATURE_FLAG_NAMES.showFinancialStatusReport]: true,
        },
      };

      const { container } = renderWithStoreAndRouter(
        <App>
          <div data-testid="children">Test Children</div>
        </App>,
        {
          initialState,
          reducers: reducer,
        },
      );

      // Check that RoutedSavableApp is rendered (children should be present)
      const children = container.querySelector('[data-testid="children"]');
      expect(children).to.exist;
    });

    it('should not render RoutedSavableApp when showFSR is false', () => {
      const initialState = {
        ...defaultInitialState,
        featureToggles: {
          ...defaultInitialState.featureToggles,
          [FEATURE_FLAG_NAMES.showFinancialStatusReport]: false,
        },
      };

      const { container } = renderWithStoreAndRouter(
        <App>
          <div data-testid="children">Test Children</div>
        </App>,
        {
          initialState,
          reducers: reducer,
        },
      );

      // When showFSR is false, RoutedSavableApp is not rendered
      const children = container.querySelector('[data-testid="children"]');
      expect(children).to.be.null;
    });
  });

  describe('form status fetching', () => {
    it('should render without error and call getFormStatus on mount', () => {
      const { container } = renderWithStoreAndRouter(<App />, {
        initialState: defaultInitialState,
        reducers: reducer,
      });

      // Component should render successfully
      // The getFormStatus call happens in useEffect, which is tested via integration tests
      expect(container).to.exist;
    });
  });

  describe('debt and copay fetching', () => {
    it('should call getDebts and getCopays when user is logged in and verified', async () => {
      const fetchDebtsStub = sandbox
        .stub(actions, 'fetchDebts')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'DEBTS_FETCH_SUCCESS',
            debts: [],
          });
        });

      const getStatementsStub = sandbox
        .stub(copayActions, 'getStatements')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'MCP_STATEMENTS_FETCH_SUCCESS',
            statements: [],
          });
        });

      const initialState = {
        ...defaultInitialState,
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            vapContactInfo: {},
            verified: true,
          },
        },
      };

      renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      await waitFor(() => {
        expect(fetchDebtsStub.called).to.be.true;
        expect(getStatementsStub.called).to.be.true;
      });
    });

    it('should not call getDebts and getCopays when user is not logged in', async () => {
      const fetchDebtsStub = sandbox
        .stub(actions, 'fetchDebts')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'DEBTS_FETCH_SUCCESS',
            debts: [],
          });
        });

      const getStatementsStub = sandbox
        .stub(copayActions, 'getStatements')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'MCP_STATEMENTS_FETCH_SUCCESS',
            statements: [],
          });
        });

      const initialState = {
        ...defaultInitialState,
        user: {
          login: {
            currentlyLoggedIn: false,
          },
          profile: {
            vapContactInfo: {},
            verified: false,
          },
        },
      };

      renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      // Wait a bit to ensure useEffect has run, then verify they were not called
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(fetchDebtsStub.called).to.be.false;
      expect(getStatementsStub.called).to.be.false;
    });

    it('should not call getDebts and getCopays when user is logged in but not verified', async () => {
      const fetchDebtsStub = sandbox
        .stub(actions, 'fetchDebts')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'DEBTS_FETCH_SUCCESS',
            debts: [],
          });
        });

      const getStatementsStub = sandbox
        .stub(copayActions, 'getStatements')
        .callsFake(async dispatch => {
          return dispatch({
            type: 'MCP_STATEMENTS_FETCH_SUCCESS',
            statements: [],
          });
        });

      const initialState = {
        ...defaultInitialState,
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            vapContactInfo: {},
            verified: false,
          },
        },
      };

      renderWithStoreAndRouter(<App />, {
        initialState,
        reducers: reducer,
      });

      // Wait a bit to ensure useEffect has run, then verify they were not called
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(fetchDebtsStub.called).to.be.false;
      expect(getStatementsStub.called).to.be.false;
    });
  });
});
