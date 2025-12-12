import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as featureToggleHook from 'platform/utilities/feature-toggles';
import App from '../../containers/App';
import * as actionsModule from '../../actions/index';
import * as copaysModule from '../../actions/copays';
import * as hooks from '../../hooks/useDetectFieldChanges';
import * as documentTitleHook from '../../hooks/useDocumentTitle';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<App /> - API Calls', () => {
  let store;
  let useDetectFieldChangesStub;
  let useDocumentTitleStub;
  let useFeatureToggleStub;
  let fetchDebtsStub;
  let getStatementsStub;
  let fetchFormStatusStub;

  const defaultState = {
    form: {
      data: {},
      isStartingOver: false,
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        verified: true,
        vapContactInfo: {},
      },
    },
    fsr: {
      isError: false,
      pending: false,
      debts: [],
      statements: [],
    },
    featureToggles: {
      loading: false,
    },
  };

  const defaultProps = {
    children: <div>Test Children</div>,
    location: { pathname: '/introduction' },
  };

  beforeEach(() => {
    // Mock custom hooks
    useDetectFieldChangesStub = sinon
      .stub(hooks, 'default')
      .returns({ shouldShowReviewButton: true });
    useDocumentTitleStub = sinon.stub(documentTitleHook, 'default');
    useFeatureToggleStub = sinon.stub(featureToggleHook, 'useFeatureToggle');
    useFeatureToggleStub.returns({
      useToggleValue: sinon.stub().returns(false),
      TOGGLE_NAMES: {},
    });

    // Mock API action creators
    fetchDebtsStub = sinon.stub(actionsModule, 'fetchDebts');
    getStatementsStub = sinon.stub(copaysModule, 'getStatements');
    fetchFormStatusStub = sinon.stub(actionsModule, 'fetchFormStatus');

    fetchDebtsStub.returns(Promise.resolve());
    getStatementsStub.returns(Promise.resolve());
    fetchFormStatusStub.returns({ type: 'FSR_API_CALL_INITIATED' });
  });

  afterEach(() => {
    useDetectFieldChangesStub.restore();
    useDocumentTitleStub.restore();
    useFeatureToggleStub.restore();
    fetchDebtsStub.restore();
    getStatementsStub.restore();
    fetchFormStatusStub.restore();
  });

  const renderComponent = (stateOverrides = {}, propsOverrides = {}) => {
    const state = { ...defaultState, ...stateOverrides };
    store = mockStore(state);
    return render(
      <Provider store={store}>
        <App {...defaultProps} {...propsOverrides} />
      </Provider>,
    );
  };

  describe('fetchDebts API call', () => {
    it('should call fetchDebts when user is logged in and verified', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: true },
        },
      });

      expect(fetchDebtsStub.called).to.be.true;
    });

    it('should not call fetchDebts when user is not logged in', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: false },
          profile: { verified: false },
        },
      });

      expect(fetchDebtsStub.called).to.be.false;
    });

    it('should not call fetchDebts when user is not verified', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: false },
        },
      });

      expect(fetchDebtsStub.called).to.be.false;
    });
  });

  describe('getStatements API call', () => {
    it('should call getStatements when user is logged in and verified', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: true },
        },
      });

      expect(getStatementsStub.called).to.be.true;
    });

    it('should not call getStatements when user is not logged in', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: false },
          profile: { verified: false },
        },
      });

      expect(getStatementsStub.called).to.be.false;
    });

    it('should not call getStatements when user is not verified', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: false },
        },
      });

      expect(getStatementsStub.called).to.be.false;
    });
  });

  describe('API call coordination', () => {
    it('should call both fetchDebts and getStatements when user is logged in and verified', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: true },
          profile: { verified: true },
        },
      });

      expect(fetchDebtsStub.called).to.be.true;
      expect(getStatementsStub.called).to.be.true;
    });

    it('should call fetchFormStatus regardless of login status', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: false },
          profile: { verified: false },
        },
      });

      expect(fetchFormStatusStub.called).to.be.true;
    });

    it('should only call fetchFormStatus when user is not logged in', () => {
      renderComponent({
        user: {
          login: { currentlyLoggedIn: false },
          profile: { verified: false },
        },
      });

      expect(fetchDebtsStub.called).to.be.false;
      expect(getStatementsStub.called).to.be.false;
      expect(fetchFormStatusStub.called).to.be.true;
    });
  });

  describe('Loading states', () => {
    it('should show loading indicator when pending is true', () => {
      const { container } = renderComponent({
        fsr: {
          pending: true,
          isError: false,
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading your information...',
      );
    });

    it('should not show loading indicator when pending is false', () => {
      const { container } = renderComponent({
        fsr: {
          pending: false,
          isError: false,
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.not.exist;
    });

    it('should show loading indicator when featureToggles.loading is true', () => {
      const { container } = renderComponent({
        featureToggles: {
          loading: true,
        },
        fsr: {
          pending: false,
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading features...',
      );
    });

    it('should show loading indicator when both pending and isLoadingFeatures are true', () => {
      const { container } = renderComponent({
        featureToggles: {
          loading: true,
        },
        fsr: {
          pending: true,
        },
      });

      const loadingIndicator = container.querySelector('va-loading-indicator');
      expect(loadingIndicator).to.exist;
      // When both are true, pending takes precedence (shows "Loading your information...")
      expect(loadingIndicator.getAttribute('message')).to.equal(
        'Loading your information...',
      );
    });
  });
});
