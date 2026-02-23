import * as apiUtils from '@department-of-veterans-affairs/platform-utilities/api';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { TOGGLE_LOGIN_MODAL } from '~/platform/site-wide/user-nav/actions';
import * as constants from '../../constants';
import IntroductionPage from '../../containers/IntroductionPage';
import { mockInquiryStatusResponse } from '../../utils/mockData';
import { getData } from '../fixtures/data/mock-form-data';
import { createURLSearchParamsMock } from '../utils/test-utils';

describe('IntroductionPage', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(constants, 'getMockTestingFlagForAPI').returns(true);
    apiRequestStub = sandbox
      .stub(apiUtils, 'apiRequest')
      .resolves(mockInquiryStatusResponse);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should show sign in alert if not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container, getByRole } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByRole('heading', { name: 'Ask VA', level: 1 })).to.exist;

    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Sign in or create an account',
    );

    expect(
      getByRole('heading', {
        name: 'Only use Ask VA for non-urgent needs',
        level: 2,
      }),
    ).to.exist;
  });

  it('should show search bar to check status if not logged in', async () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const searchInput = container.querySelector(
      'va-search-input[label="Reference number"]',
    );
    expect(searchInput).to.exist;
  });

  it('should ask for verification if loa1 and logged in', async () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      loaLevel: 1,
      signInServiceName: 'idme',
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(container.querySelector('va-alert-sign-in[variant="verifyIdMe"]'))
        .to.exist;
    });
  });

  it('should allow asking a question if loa3 and logged in', async () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      loaLevel: 3,
      signInServiceName: 'idme',
    });
    const { queryByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(queryByText('Ask a new question')).to.exist;
    });
  });

  it('should return correct start page path', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const propsWithPath = {
      ...props,
      route: {
        ...props.route,
        pathname: '/introduction',
        pageList: [{ path: '/introduction' }, { path: '/first-page' }],
      },
    };
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...propsWithPath} />
      </Provider>,
    );

    // Verify link to start without signing in exists
    const startLink = container.querySelector('.vads-c-action-link--blue');
    expect(startLink).to.exist;
    expect(startLink.textContent).to.equal(
      'Start your question without signing in',
    );
  });

  it('should show sign in modal when URL has showSignInModal=true', async () => {
    const originalSearch = window.location.search;
    const originalURLSearchParams = window.URLSearchParams;
    window.URLSearchParams = createURLSearchParamsMock('true');

    try {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?showSignInModal=true',
          toString: () => 'http://localhost/?showSignInModal=true',
          origin: 'http://localhost',
          pathname: '/',
        },
        writable: true,
      });

      const dispatchSpy = sinon.spy(action => {
        if (typeof action === 'function') {
          return action(dispatchSpy, () => ({
            featureToggles: { signInServiceEnabled: false },
          }));
        }
        return action;
      });

      // Mock window.history.pushState
      const pushStateSpy = sinon.spy();
      window.history.pushState = pushStateSpy;

      // Initial render with loading state
      const loadingData = getData({
        loggedIn: false,
        loading: true,
      });

      // Override the mock store's dispatch with our spy
      const loadingStore = {
        ...loadingData.mockStore,
        dispatch: dispatchSpy,
      };

      const { rerender } = render(
        <Provider store={loadingStore}>
          <IntroductionPage {...loadingData.props} />
        </Provider>,
      );

      // Wait for initial render
      await waitFor(() => {
        const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
          const action = call.args[0];
          return (
            typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
          );
        });
        expect(toggleModalCalls.length).to.equal(0);
      });

      // Update to loaded state
      const loadedData = getData({
        loggedIn: false,
        loading: false,
      });

      // Override the mock store's dispatch with our spy
      const loadedStore = {
        ...loadedData.mockStore,
        dispatch: dispatchSpy,
        subscribe: listener => {
          listener();
          return () => {};
        },
      };

      rerender(
        <Provider store={loadedStore}>
          <IntroductionPage {...loadedData.props} />
        </Provider>,
      );

      // Wait for the effect to run after loading is complete
      await waitFor(
        () => {
          const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
            const action = call.args[0];
            return (
              typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
            );
          });
          expect(toggleModalCalls.length).to.be.greaterThan(0);
          const lastToggleModalCall =
            toggleModalCalls[toggleModalCalls.length - 1];
          expect(lastToggleModalCall.args[0]).to.deep.equal({
            type: TOGGLE_LOGIN_MODAL,
            isOpen: true,
            trigger: 'header',
          });
        },
        { timeout: 1000 },
      );

      // Verify window.history.pushState was called
      expect(pushStateSpy.calledOnce).to.be.true;
    } finally {
      window.URLSearchParams = originalURLSearchParams;
      window.location.search = originalSearch;
    }
  });

  it('should not show sign in modal when URL has showSignInModal=false', async () => {
    const originalSearch = window.location.search;
    const originalURLSearchParams = window.URLSearchParams;
    window.URLSearchParams = createURLSearchParamsMock('false');

    try {
      const dispatchSpy = sinon.spy(action => {
        if (typeof action === 'function') {
          return action(dispatchSpy, () => ({
            featureToggles: {
              signInServiceEnabled: false,
            },
          }));
        }
        return action;
      });

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          search: '?showSignInModal=false',
          toString: () => 'http://localhost/?showSignInModal=false',
          origin: 'http://localhost',
          pathname: '/',
        },
        writable: true,
      });

      // Mock window.history.pushState
      const pushStateSpy = sinon.spy();
      window.history.pushState = pushStateSpy;

      // Initial render with loading state
      const loadingData = getData({
        loggedIn: false,
        loading: true,
      });

      // Override the mock store's dispatch with our spy
      const loadingStore = {
        ...loadingData.mockStore,
        dispatch: dispatchSpy,
      };

      const { rerender } = render(
        <Provider store={loadingStore}>
          <IntroductionPage {...loadingData.props} />
        </Provider>,
      );

      // Wait for initial render
      await waitFor(() => {
        const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
          const action = call.args[0];
          return (
            typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
          );
        });
        expect(toggleModalCalls.length).to.equal(0);
      });

      // Update to loaded state
      const loadedData = getData({
        loggedIn: false,
        loading: false,
      });

      // Override the mock store's dispatch with our spy
      const loadedStore = {
        ...loadedData.mockStore,
        dispatch: dispatchSpy,
        subscribe: listener => {
          listener();
          return () => {};
        },
      };

      rerender(
        <Provider store={loadedStore}>
          <IntroductionPage {...loadedData.props} />
        </Provider>,
      );

      // Wait for the effect to run after loading is complete
      await waitFor(
        () => {
          const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
            const action = call.args[0];
            return (
              typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
            );
          });
          expect(toggleModalCalls.length).to.equal(0);
        },
        { timeout: 1000 },
      );

      // Verify window.history.pushState was not called
      expect(pushStateSpy.called).to.be.false;
    } finally {
      window.URLSearchParams = originalURLSearchParams;
      window.location.search = originalSearch;
    }
  });

  it('should not show sign in modal when URL has invalid showSignInModal value', async () => {
    const originalSearch = window.location.search;
    const originalURLSearchParams = window.URLSearchParams;
    window.URLSearchParams = createURLSearchParamsMock('invalid');

    try {
      const dispatchSpy = sinon.spy(action => {
        if (typeof action === 'function') {
          return action(dispatchSpy, () => ({
            featureToggles: {
              signInServiceEnabled: false,
            },
          }));
        }
        return action;
      });

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          search: '?showSignInModal=invalid',
          toString: () => 'http://localhost/?showSignInModal=invalid',
          origin: 'http://localhost',
          pathname: '/',
        },
        writable: true,
      });

      // Mock window.history.pushState
      const pushStateSpy = sinon.spy();
      window.history.pushState = pushStateSpy;

      // Initial render with loading state
      const loadingData = getData({
        loggedIn: false,
        loading: true,
      });

      // Override the mock store's dispatch with our spy
      const loadingStore = {
        ...loadingData.mockStore,
        dispatch: dispatchSpy,
      };

      const { rerender } = render(
        <Provider store={loadingStore}>
          <IntroductionPage {...loadingData.props} />
        </Provider>,
      );

      // Wait for initial render
      await waitFor(() => {
        const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
          const action = call.args[0];
          return (
            typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
          );
        });
        expect(toggleModalCalls.length).to.equal(0);
      });

      // Update to loaded state
      const loadedData = getData({
        loggedIn: false,
        loading: false,
      });

      // Override the mock store's dispatch with our spy
      const loadedStore = {
        ...loadedData.mockStore,
        dispatch: dispatchSpy,
        subscribe: listener => {
          listener();
          return () => {};
        },
      };

      rerender(
        <Provider store={loadedStore}>
          <IntroductionPage {...loadedData.props} />
        </Provider>,
      );

      // Wait for the effect to run after loading is complete
      await waitFor(
        () => {
          const toggleModalCalls = dispatchSpy.getCalls().filter(call => {
            const action = call.args[0];
            return (
              typeof action === 'object' && action.type === TOGGLE_LOGIN_MODAL
            );
          });
          expect(toggleModalCalls.length).to.equal(0);
        },
        { timeout: 1000 },
      );

      // Verify window.history.pushState was not called
      expect(pushStateSpy.called).to.be.false;
    } finally {
      window.URLSearchParams = originalURLSearchParams;
      window.location.search = originalSearch;
    }
  });

  it('should focus on status message after search', async () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container, findByTestId } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const searchInput = container.querySelector('va-search-input');
    expect(searchInput).to.exist;

    // First simulate input change
    searchInput.value = 'A-20250106-308944';
    searchInput.dispatchEvent(
      new window.Event('input', {
        detail: { value: 'A-20250106-308944' },
        bubbles: true,
        cancelable: true,
      }),
    );

    // Then simulate search submission
    searchInput.dispatchEvent(
      new window.Event('submit', {
        detail: { value: 'A-20250106-308944' },
        bubbles: true,
        cancelable: true,
      }),
    );

    // Wait for the UI to update
    const statusContainer = await findByTestId('status-message');
    const statusHeading = statusContainer.querySelector('h3');
    expect(statusHeading).to.exist;
    expect(document.activeElement).to.equal(statusHeading);
    expect(statusHeading.textContent).to.include(
      'Showing the status for reference number',
    );
    expect(statusHeading.textContent).to.include('A-20250106-308944');
  });

  it('should focus on error message when search returns no results', async () => {
    const { props, mockStore } = getData({ loggedIn: false });
    apiRequestStub.rejects(new Error('Not found'));

    const { container, findByTestId } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const searchInput = container.querySelector('va-search-input');
    expect(searchInput).to.exist;

    // First simulate input change
    searchInput.value = 'INVALID-REF';
    searchInput.dispatchEvent(
      new window.Event('input', {
        detail: { value: 'INVALID-REF' },
        bubbles: true,
        cancelable: true,
      }),
    );

    // Then simulate search submission
    searchInput.dispatchEvent(
      new window.Event('submit', {
        detail: { value: 'INVALID-REF' },
        bubbles: true,
        cancelable: true,
      }),
    );

    // Wait for the UI to update
    const errorContainer = await findByTestId('error-message');
    const errorMessage = errorContainer.querySelector('p[tabindex="-1"]');
    expect(errorMessage).to.exist;
    expect(document.activeElement).to.equal(errorMessage);
    expect(errorMessage.textContent).to.include('INVALID-REF');
    expect(errorMessage.textContent).to.include('Check your reference number');
  });
});
