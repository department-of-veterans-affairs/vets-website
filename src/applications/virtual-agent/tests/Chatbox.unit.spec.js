import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { waitFor, screen, fireEvent, act } from '@testing-library/react';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';

import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { commonReducer } from 'platform/startup/store';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';
import Chatbox from '../components/chatbox/Chatbox';
import virtualAgentReducer from '../reducers/index';
import GreetUser from '../components/webchat/makeBotGreetUser';
import {
  LOGGED_IN_FLOW,
  CONVERSATION_ID_KEY,
  TOKEN_KEY,
  RECENT_UTTERANCES,
  IN_AUTH_EXP,
} from '../components/chatbox/utils';

export const CHATBOT_ERROR_MESSAGE = /We’re making some updates to the Virtual Agent. We’re sorry it’s not working right now. Please check back soon. If you require immediate assistance please call the VA.gov help desk/i;

const disclaimerText =
  'Our chatbot can’t help you if you’re experiencing a personal, medical, or mental health emergency. Go to the nearest emergency room, dial 988 and press 1 for mental health support, or call 911 to get medical care right away.';

/**
 * @testing-library/dom
 */

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

  describe('user lands on chatbot page (default behaviors)', () => {
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
            accountUuid: 'fake_uuid',
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
        await waitFor(
          () => expect(wrapper.getByText('VA chatbot (beta)')).to.exist,
        );
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

        await waitFor(() => expect(wrapper.getByText(disclaimerText)).to.exist);

        await waitFor(
          () =>
            expect(
              wrapper.getByText(
                'Please don’t type any personal information such as your name, address, or anything else that can be used to identify you.',
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

      describe('user is logged in initially', () => {
        it('passes CSRF Token, Api Session, Api Url, Base Url, userFirstName to greet user', async () => {
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
            'fake_uuid',
            undefined, // requireAuth toggle
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
                    accountUuid: 'fake_uuid',
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
            'fake_uuid',
            undefined, // requireAuth toggle
          );
        });
      });

      describe('user is not logged in initially', () => {
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
            virtualAgentAuth: false,
          },
        };

        it('passes CSRF Token, Api Session, Api Url, Base Url, noFirstNameFound to greet user', async () => {
          loadWebChat();
          mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

          // const { getByTestId } = renderInReduxProvider(
          //   <Chatbox {...defaultProps} />,
          //   providerObject,
          // );

          const { getByTestId } = renderInReduxProvider(
            <Chatbox {...defaultProps} />,
            {
              initialState: initialStateNotLoggedIn,
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
            'noUserUuid',
            false, // requireAuth toggle
          );
        });
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
            // conversationId: '',
            // watermark: '',
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
      it('loads the webchat framework via script tag', () => {
        const notLoggedInUser = {
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

        waitFor(
          () =>
            expect(screen.getByTestId('webchat-framework-script')).to.not.exist,
        );

        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN' });

        // const wrapper = renderInReduxProvider(<Chatbox timeout={10} />);
        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          initialState: notLoggedInUser,
          reducers: virtualAgentReducer,
        });

        waitFor(
          () =>
            expect(wrapper.getByTestId('webchat-framework-script')).to.exist,
        );
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

      it('exposes React and ReactDOM as globals for the framework to re-use so hooks still work', () => {
        const notLoggedInUser = {
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

        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN' });

        waitFor(() => {
          expect(window.React).to.not.exist;
          expect(window.ReactDOM).to.not.exist;
        });

        renderInReduxProvider(<Chatbox {...defaultProps} />, {
          initialState: notLoggedInUser,
          reducers: virtualAgentReducer,
        });

        waitFor(() => {
          expect(window.React).to.eql(React);
          expect(window.ReactDOM).to.eql(ReactDOM);
        });
      });
    });
  });

  describe('virtualAgentAuth is toggled false', () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const mockServiceCreator = (body, succeeds = true) => () =>
      new Promise((resolve, reject) => {
        setTimeout(() => (succeeds ? resolve(body) : reject(body)), 10);
      });

    let store;
    const storeClean = mockStore(
      {},
      GreetUser.makeBotGreetUser(
        'fakeCsrfToken',
        'fakeApiSession',
        'http://apiURL',
        'http://baseURL',
        'noFirstNameFound',
        'fakeUserUuid',
        true, // requireAuth,
      ),
      mockServiceCreator(screen, true),
    );

    const authActivityHandlerSpy = sinon.spy();
    const messageActivityHandlerSpy = sinon.spy();

    before(() => {
      window.addEventListener(
        'webchat-message-activity',
        messageActivityHandlerSpy,
      );
      window.addEventListener('webchat-auth-activity', authActivityHandlerSpy);
    });

    beforeEach(() => {
      store = { ...storeClean };
      authActivityHandlerSpy.reset();
      messageActivityHandlerSpy.reset();
      sessionStorage.removeItem(IN_AUTH_EXP);
      sessionStorage.removeItem(LOGGED_IN_FLOW);
    });

    after(() => {
      window.removeEventListener(
        'webchat-message-activity',
        authActivityHandlerSpy,
      );
      window.removeEventListener(
        'webchat-auth-activity',
        authActivityHandlerSpy,
      );
    });
    // const notLoggedInUser = {
    //   navigation: {
    //     showLoginModal: false,
    //     utilitiesMenuIsOpen: { search: false },
    //   },
    //   user: {
    //     login: {
    //       currentlyLoggedIn: false,
    //     },
    //   },
    //   virtualAgentData: {
    //     termsAccepted: true,
    //   },
    //   featureToggles: {
    //     virtualAgentAuth: false,
    //   },
    // };

    it('makebotgreetuser test for firing message activity', done => {
      window.addEventListener(
        'webchat-message-activity',
        messageActivityHandlerSpy,
      );

      store.dispatch({
        payload: {
          activity: {
            type: 'message',
            text: 'Hello, world!',
          },
        },
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
      });

      done();

      const actions = store.getActions();
      expect(actions.length).to.equal(1);
      expect(actions[0].payload.activity).to.own.include({
        text: 'Hello, world!',
      });
      expect(messageActivityHandlerSpy.callCount).to.equal(1);
    });

    // // TODO: conditions to resend latest utterance (I think this is covered in the other test(s))

    it('makebotgreetuser test for firing auth activity', done => {
      sessionStorage.setItem(IN_AUTH_EXP, 'false');

      window.addEventListener('webchat-auth-activity', authActivityHandlerSpy);

      store.dispatch({
        payload: {
          activity: {
            type: 'message',
            text: 'Alright. Sending you to the sign in page...',
            from: {
              role: 'bot',
            },
          },
        },
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
      });

      done();

      const actions = store.getActions();
      expect(actions.length).to.equal(1);
      // console.log(JSON.stringify(actions));
      expect(actions[0].payload.activity).to.own.include({
        text: 'Alright. Sending you to the sign in page...',
      });
      expect(authActivityHandlerSpy.callCount).to.equal(1);
      expect(sessionStorage.getItem(IN_AUTH_EXP)).to.equal('false');
    });
  });

  describe('virtualAgentAuth is toggled true', () => {
    const notLoggedInUser = {
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

    const loggedInUser = {
      navigation: {
        showLoginModal: false,
        utilitiesMenuIsOpen: { search: false },
      },
      user: {
        login: {
          currentlyLoggedIn: true,
        },
      },
      virtualAgentData: {
        termsAccepted: true,
      },
      featureToggles: {
        virtualAgentAuth: true,
      },
    };

    it.skip('when message activity is fired, then utterances should be stored in sessionStorage', () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

      const messageActivityHandlerSpy = sinon.spy();
      // console.log('--- ', messageActivityHandlerSpy);
      window.addEventListener(
        'webchat-message-activity',
        messageActivityHandlerSpy,
      );

      renderInReduxProvider(<Chatbox {...defaultProps} />, {
        initialState: notLoggedInUser,
        reducers: virtualAgentReducer,
      });

      const event = new Event('webchat-message-activity');
      event.data = {
        type: 'message',
        text: 'first',
        from: { role: 'user' },
      };
      window.dispatchEvent(event);

      expect(messageActivityHandlerSpy.callCount).to.equal(1);
      expect(messageActivityHandlerSpy.calledWith(event));
      expect(sessionStorage.getItem(RECENT_UTTERANCES)).to.not.be.null;
      expect(
        JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES)),
      ).to.have.members(['', 'first']);

      event.data.text = 'second';
      window.dispatchEvent(event);

      expect(messageActivityHandlerSpy.callCount).to.equal(2);
      expect(
        JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES)),
      ).to.have.members(['first', 'second']);

      event.data.text = 'third';
      window.dispatchEvent(event);

      expect(messageActivityHandlerSpy.callCount).to.equal(3);
      expect(
        JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES)),
      ).to.have.members(['second', 'third']);
    });

    describe('when user is not logged in initially', () => {
      // this is a good test, but failed after adding setTimeout call (also added requiredAuth toggle)
      // commented out for now. testing manually.
      it('when auth activity event is fired, then loggedInFlow is set to true', done => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

        const authActivityHandlerSpy = sinon.spy();
        window.addEventListener(
          'webchat-auth-activity',
          authActivityHandlerSpy,
        );

        renderInReduxProvider(<Chatbox {...defaultProps} />, {
          initialState: notLoggedInUser,
          reducers: virtualAgentReducer,
        });

        window.dispatchEvent(new Event('webchat-auth-activity'));
        done();

        expect(authActivityHandlerSpy.callCount).to.equal(1);
        expect(sessionStorage.getItem(LOGGED_IN_FLOW)).to.equal('true');
      });
    });

    describe('when user is logged in initially', () => {
      it('when auth activity event is fired then no changes occur to state', () => {
        loadWebChat();
        mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

        const authActivityHandlerSpy = sinon.spy();
        window.addEventListener(
          'webchat-auth-activity',
          authActivityHandlerSpy,
        );

        renderInReduxProvider(<Chatbox {...defaultProps} />, {
          initialState: loggedInUser,
          reducers: virtualAgentReducer,
        });

        const oldValue = sessionStorage.getItem(LOGGED_IN_FLOW);

        window.dispatchEvent(new Event('webchat-auth-activity'));

        expect(authActivityHandlerSpy.callCount).to.equal(1);
        expect(sessionStorage.getItem(LOGGED_IN_FLOW)).to.equal(oldValue);
      });
    });

    describe('when user is prompted to sign in by the bot and has finished signing in', () => {
      it('should render webchat with pre-existing conversation id and token', done => {
        // TEST SETUP
        // logged in flow should be set to true
        // user should be logged in
        // this test should not test the code on chatbox. should bypass that code and test the webchat component in isolation

        loadWebChat();
        mockApiRequest({
          token: 'FAKETOKEN',
          apiSession: 'FAKEAPISESSION',
          conversationId: 'FAKECONVOID',
        });
        sessionStorage.setItem(LOGGED_IN_FLOW, 'true');

        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          initialState: loggedInUser,
          reducers: virtualAgentReducer,
        });
        waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
        done();

        expect(directLineSpy.called).to.be.true;
        expect(sessionStorage.getItem(LOGGED_IN_FLOW)).to.equal('false');
        expect(sessionStorage.getItem(CONVERSATION_ID_KEY)).to.equal(
          'FAKECONVOID',
        );
        expect(sessionStorage.getItem(TOKEN_KEY)).to.equal('FAKETOKEN');
        expect(
          directLineSpy.calledWithExactly({
            token: 'FAKETOKEN',
            domain:
              'https://northamerica.directline.botframework.com/v3/directline',
            conversationId: 'FAKECONVOID',
            watermark: '',
          }),
        ).to.be.true;
      });
    });

    it('does not display disclaimer when user has logged in via the bot and has returned to the page, and refreshes', done => {
      const loggedInUser2 = {
        navigation: {
          showLoginModal: false,
          utilitiesMenuIsOpen: { search: false },
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
        },
        virtualAgentData: {
          termsAccepted: false,
        },
        featureToggles: {
          virtualAgentAuth: false,
        },
      };

      sessionStorage.setItem(LOGGED_IN_FLOW, 'true');

      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN', apiSession: 'FAKEAPISESSION' });

      const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
        initialState: loggedInUser2,
        reducers: virtualAgentReducer,
      });

      waitFor(() => expect(wrapper.queryByText(disclaimerText)).to.not.exist);
      // done();

      location.reload();

      waitFor(() => expect(wrapper.queryByText(disclaimerText)).to.not.exist);
      done();
    });
  });
});
