import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { waitFor, screen, fireEvent, act } from '@testing-library/react';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import virtualAgentReducer from '../reducers/index';

import Chatbox from '../components/chatbox/Chatbox';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { commonReducer } from 'platform/startup/store';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';
import Main from 'platform/site-wide/user-nav/containers/Main';
import GreetUser from '../components/webchat/makeBotGreetUser';

export const CHATBOT_ERROR_MESSAGE = /We’re making some updates to the Virtual Agent. We’re sorry it’s not working right now. Please check back soon. If you require immediate assistance please call the VA.gov help desk/i;

describe('App', () => {
  let oldWindow;
  let directLineSpy;
  let createStoreSpy;
  const sandbox = sinon.createSandbox();
  const defaultProps = { timeout: 10 };

  function loadWebChat() {
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      WebChat: {
        createStore: createStoreSpy,
        createDirectLine: directLineSpy,
        ReactWebChat: () => {
          return <div />;
        },
      },
    });
  }

  function createTestStore(initialState, reducers = {}) {
    return createStore(
      combineReducers({
        ...commonReducer,
        ...reducers,
      }),
      initialState,
      applyMiddleware(thunk),
    );
  }

  beforeEach(() => {
    createStoreSpy = sandbox.spy();
    directLineSpy = sandbox.spy();
    oldWindow = global.window;
    global.window.localStorage.setItem('csrfToken', 'FAKECSRF');
    sandbox.spy(Sentry, 'captureException');
    sandbox.spy(GreetUser, 'makeBotGreetUser');
  });

  afterEach(() => {
    global.window = oldWindow;
    sandbox.restore();
  });

  async function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  describe('user is logged in', () => {
    const providerObject = {
      initialState: {
        featureToggles: {
          loading: false,
        },
        virtualAgentData: {
          termsAccepted: true,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            userFullName: {
              first: 'MARK',
            },
          },
        },
      },
      reducers: virtualAgentReducer,
    };

    describe('web chat script is already loaded', () => {
      it('renders web chat', async () => {
        loadWebChat();
        mockApiRequest({});

        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
      });

      it('should not create a store more than once', async () => {
        loadWebChat();
        mockApiRequest({});

        const { getByTestId } = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(getByTestId('webchat')).to.exist);

        expect(createStoreSpy.callCount).to.equal(1);
      });

      it('passes CSRF Token, Api Session, Api Url, and Base Url to greet user', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

        const { getByTestId } = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(getByTestId('webchat')).to.exist);

        sinon.assert.calledWithExactly(
          GreetUser.makeBotGreetUser,
          'FAKECSRF',
          'FAKEAPISESSION',
          'https://dev-api.va.gov',
          'https://dev.va.gov',
          'Mark',
        );
      });

      it('passes blank string when user is signed in but doesnt have a name', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

        const { getByTestId } = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          {
            initialState: {
              featureToggles: {
                loading: false,
              },
              virtualAgentData: {
                termsAccepted: true,
              },
              user: {
                login: {
                  currentlyLoggedIn: true,
                },
                profile: {
                  userFullName: {
                    first: null,
                  },
                },
              },
            },
            reducers: virtualAgentReducer,
          },
        );

        await waitFor(() => expect(getByTestId('webchat')).to.exist);

        sinon.assert.calledWithExactly(
          GreetUser.makeBotGreetUser,
          'FAKECSRF',
          'FAKEAPISESSION',
          'https://dev-api.va.gov',
          'https://dev.va.gov',
          'noFirstNameFound',
        );
      });

      it('presents disclaimer text when user has not acknowledged the disclaimer.', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });
        const unacknowledgedUserStore = {
          initialState: {
            featureToggles: {
              loading: false,
            },
            virtualAgentData: {
              termsAccepted: false,
            },
            user: {
              login: {
                currentlyLoggedIn: true,
              },
              profile: {
                userFullName: {
                  first: 'Steve',
                },
              },
            },
          },
          reducers: virtualAgentReducer,
        };

        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          unacknowledgedUserStore,
        );

        await waitFor(
          () =>
            expect(
              wrapper.getByText(
                'This virtual agent is still in development and cannot help with personal, medical or mental health emergencies. Thank you for understanding.',
              ),
            ).to.exist,
        );

        await waitFor(
          () =>
            expect(
              wrapper.getByText(
                'We ask that you do not enter personal information that can be used to identify you.',
              ),
            ).to.exist,
        );
      });

      it('displays sign in modal when user clicks sign in button', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });
        const unacknowledgedUserStore = {
          initialState: {
            featureToggles: {
              loading: false,
            },
            virtualAgentData: {
              termsAccepted: false,
            },
            user: {
              login: {
                currentlyLoggedIn: true,
              },
              profile: {
                userFullName: {
                  first: 'Steve',
                },
              },
            },
          },
          reducers: virtualAgentReducer,
        };

        const store = createTestStore(
          unacknowledgedUserStore.initialState,
          unacknowledgedUserStore.reducers,
        );

        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          store,
        });

        const button = wrapper.getByTestId('btnAcceptDisclaimer');

        await waitFor(() => expect(button).to.exist);

        await waitFor(
          () =>
            expect(store.getState().virtualAgentData.termsAccepted).to.be.false,
        );

        await act(async () => {
          fireEvent.click(button);
        });

        expect(store.getState().virtualAgentData.termsAccepted).to.be.true;
      });
    });

    describe('web chat script has not loaded', () => {
      it('should not render webchat until webchat framework is loaded', async () => {
        mockApiRequest({});

        const wrapper = renderInReduxProvider(
          <Chatbox timeout={1000} />,
          providerObject,
        );

        expect(wrapper.getByRole('progressbar')).to.exist;
        expect(wrapper.queryByTestId('webchat')).to.not.exist;

        await wait(500);

        loadWebChat();

        await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
      });

      it('should display error if webchat does not load after x milliseconds', async () => {
        mockApiRequest({});

        const wrapper = renderInReduxProvider(
          <Chatbox timeout={1500} />,
          providerObject,
        );

        expect(wrapper.getByRole('progressbar')).to.exist;

        await wait(2000);

        loadWebChat();

        await waitFor(
          () => expect(wrapper.getByText(CHATBOT_ERROR_MESSAGE)).to.exist,
        );

        expect(wrapper.queryByRole('progressbar')).to.not.exist;
        expect(Sentry.captureException.called).to.be.true;
        expect(Sentry.captureException.getCall(0).args[0].message).equals(
          'Failed to load webchat framework',
        );
      });
    });

    describe('while feature flags are loading', () => {
      const getTokenCalled = () => {
        return fetch.called;
      };

      const initialStoreStateWithLoadingToggleTrue = {
        initialState: {
          featureToggles: {
            loading: true,
          },
          virtualAgentData: {
            termsAccepted: true,
          },
          user: {
            login: {
              currentlyLoggedIn: true,
            },
            profile: {
              userFullName: {
                first: 'MARK',
              },
            },
          },
        },
        reducers: virtualAgentReducer,
      };

      it('should not fetch token', () => {
        loadWebChat();

        mockApiRequest({});

        renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          initialStoreStateWithLoadingToggleTrue,
        );

        expect(getTokenCalled()).to.equal(false);
      });

      it('should display loading indicator', () => {
        loadWebChat();

        mockApiRequest({});

        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          initialStoreStateWithLoadingToggleTrue,
        );

        expect(wrapper.getByRole('progressbar')).to.exist;

        expect(wrapper.queryByTestId('webchat')).to.not.exist;
      });

      it('should display error after loading feature toggles has not finished within timeout', async () => {
        loadWebChat();

        const wrapper = renderInReduxProvider(
          <Chatbox timeout={100} />,
          initialStoreStateWithLoadingToggleTrue,
        );

        expect(wrapper.getByRole('progressbar')).to.exist;

        await waitFor(
          () => expect(wrapper.getByText(CHATBOT_ERROR_MESSAGE)).to.exist,
        );

        expect(Sentry.captureException.called).to.be.true;
        expect(Sentry.captureException.getCall(0).args[0].message).equals(
          'Could not load feature toggles within timeout',
        );
      });

      it('should not rerender if feature toggles load before timeout', async () => {
        loadWebChat();

        mockApiRequest({});

        const store = createTestStore(
          {
            featureToggles: {
              loading: true,
            },
            virtualAgentData: {
              termsAccepted: true,
            },
            user: {
              login: {
                currentlyLoggedIn: true,
              },
              profile: {
                userFullName: {
                  first: 'MARK',
                },
              },
            },
          },
          virtualAgentReducer,
        );

        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          store,
        });

        expect(getTokenCalled()).to.equal(false);

        expect(wrapper.getByRole('progressbar')).to.exist;

        store.dispatch({ type: FETCH_TOGGLE_VALUES_SUCCEEDED, payload: {} });

        wait(100);

        await waitFor(() => expect(getTokenCalled()).to.equal(true));

        expect(Sentry.captureException.called).to.be.false;
      });

      it('should call token api after loading feature toggles', async () => {
        loadWebChat();

        mockApiRequest({});

        const store = createTestStore(
          initialStoreStateWithLoadingToggleTrue.initialState,
          initialStoreStateWithLoadingToggleTrue.reducers,
        );

        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          store,
        });

        expect(getTokenCalled()).to.equal(false);

        expect(wrapper.getByRole('progressbar')).to.exist;

        store.dispatch({ type: FETCH_TOGGLE_VALUES_SUCCEEDED, payload: {} });

        await waitFor(() => expect(getTokenCalled()).to.equal(true));
      });
    });

    describe('on initial load', () => {
      it('should show loading indicator', () => {
        loadWebChat();
        mockApiRequest({ token: 'ANOTHERFAKETOKEN' });
        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        expect(wrapper.getByRole('progressbar')).to.exist;
      });
    });

    describe('when token is valid', () => {
      it('should render web chat', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN' });
        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);

        expect(directLineSpy.called).to.be.true;
        expect(
          directLineSpy.calledWith({
            token: 'FAKETOKEN',
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
          }),
        ).to.be.true;
      });
    });

    describe('when api returns error', () => {
      it('should display error message', async () => {
        loadWebChat();
        mockApiRequest({}, false);
        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(
          () => expect(wrapper.getByText(CHATBOT_ERROR_MESSAGE)).to.exist,
        );

        expect(Sentry.captureException.called).to.be.true;
        expect(Sentry.captureException.getCall(0).args[0].message).equals(
          'Could not retrieve virtual agent token',
        );
      });
    });

    describe('when api returns error one time, but works after a retry', () => {
      it('should render web chat', async () => {
        loadWebChat();
        mockMultipleApiRequests([
          { response: {}, shouldResolve: false },
          { response: { token: 'FAKETOKEN' }, shouldResolve: true },
        ]);

        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);

        expect(Sentry.captureException.called).to.be.false;
      });
    });

    describe('when chatbox is rendered', () => {
      it.skip('loads the webchat framework via script tag', () => {
        expect(screen.queryByTestId('webchat-framework-script')).to.not.exist;

        const wrapper = renderInReduxProvider(<Chatbox timeout={10} />);

        expect(wrapper.getByTestId('webchat-framework-script')).to.exist;
      });

      it('loads the webchat framework only once', async () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN' });
        const wrapper = renderInReduxProvider(
          <Chatbox {...defaultProps} />,
          providerObject,
        );

        await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
        expect(
          wrapper.queryAllByTestId('webchat-framework-script'),
        ).to.have.lengthOf(1);
      });

      it.skip('exposes React and ReactDOM as globals for the framework to re-use so hooks still work', () => {
        expect(window.React).to.not.exist;
        expect(window.ReactDOM).to.not.exist;

        renderInReduxProvider(<Chatbox timeout={10} />);

        expect(window.React).to.eql(React);
        expect(window.ReactDOM).to.eql(ReactDOM);
      });
    });
  });
  describe('when user is not logged in', () => {
    const initialStateNotLoggedIn = {
      navigation: {
        showLoginModal: false,
        utilitiesMenuIsOpen: { search: false },
      },
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
      virtualAgentData: {
        termsAccepted: true,
      },
      featureToggles: {
        virtualAgentAuth: true,
      },
    };

    it('displays a login widget', async () => {
      const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
        initialState: initialStateNotLoggedIn,
        reducers: virtualAgentReducer,
      });

      await waitFor(
        () =>
          expect(wrapper.getByText('Please sign in to access the chatbot')).to
            .exist,
      );
    });

    it('displays sign in modal when user clicks sign in button', async () => {
      const store = createTestStore(
        initialStateNotLoggedIn,
        virtualAgentReducer,
      );

      const wrapper = renderInReduxProvider(
        <>
          <Chatbox {...defaultProps} />
          <Main />
        </>,
        {
          store,
        },
      );
      const button = wrapper.getByText('Sign in to VA.gov');

      expect(wrapper.queryByRole('dialog')).to.not.exist;

      await act(async () => {
        fireEvent.click(button);
      });

      expect(store.getState().navigation.showLoginModal).to.be.true;
      expect(wrapper.getByRole('dialog')).to.exist;
    });

    it('does not display chatbot', async () => {
      const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
        initialState: {
          initialStateNotLoggedIn,
        },
        reducers: virtualAgentReducer,
      });

      const alertText = wrapper.queryByText('Loading Virtual Agent');

      expect(alertText).to.not.exist;
    });
  });

  describe('virtualAgentAuth is toggled false', () => {
    const initialStateAuthNotRequired = {
      navigation: {
        showLoginModal: false,
        utilitiesMenuIsOpen: { search: false },
      },
      user: {
        login: {
          currentlyLoggedIn: false,
        },
      },
      virtualAgentData: {
        termsAccepted: false,
      },
      featureToggles: {
        virtualAgentAuth: false,
      },
    };

    it('displays disclaimer', async () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

      const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
        initialState: initialStateAuthNotRequired,
        reducers: virtualAgentReducer,
      });

      await waitFor(
        () =>
          expect(
            wrapper.getByText(
              'This virtual agent is still in development and cannot help with personal, medical or mental health emergencies. Thank you for understanding.',
            ),
          ).to.exist,
      );
    });
  });
});
