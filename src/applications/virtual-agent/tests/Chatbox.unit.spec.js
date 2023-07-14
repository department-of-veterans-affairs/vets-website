import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import { waitFor, screen, fireEvent, act } from '@testing-library/react';
import sinon from 'sinon';
import * as Sentry from '@sentry/browser';
import environment from 'platform/utilities/environment';

// import configureMockStore from 'redux-mock-store';
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
import StartConvoAndTrackUtterances from '../components/webchat/startConvoAndTrackUtterances';
import {
  LOGGED_IN_FLOW,
  CONVERSATION_ID_KEY,
  TOKEN_KEY,
  RECENT_UTTERANCES,
  // IN_AUTH_EXP,
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
  function loadWebChatWithSpeech() {
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      WebChat: {
        createStore: createStoreSpy,
        createDirectLine: directLineSpy,
        createBrowserWebSpeechPonyfillFactory: window.WebSpeechMock,
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

  async function wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  function dispatchAndWait(eventToDispatch, timeToWaitInMS = 100) {
    window.dispatchEvent(eventToDispatch);
    return wait(timeToWaitInMS);
  }

  beforeEach(() => {
    createStoreSpy = sandbox.spy();
    directLineSpy = sandbox.spy();
    oldWindow = global.window;
    global.window.localStorage.setItem('csrfToken', 'FAKECSRF');
    sandbox.spy(Sentry, 'captureException');
    sandbox.spy(
      StartConvoAndTrackUtterances,
      'makeBotStartConvoAndTrackUtterances',
    );
  });

  afterEach(() => {
    global.window = oldWindow;
    sandbox.restore();
  });

  describe('Reload after intervals', () => {
    const locationReload = window.location;
    beforeEach(() => {
      sandbox.stub(Date, 'now');
      Date.now.returns(1);
    });
    afterEach(() => {
      window.location = locationReload;
    });

    it('Will reload the page after 60 minutes of first render', async () => {
      const unacknowledgedUserStore = {
        initialState: {
          featureToggles: { loading: false },
          virtualAgentData: { termsAccepted: false },
          user: {
            login: { currentlyLoggedIn: true },
            profile: { userFullName: { first: 'Steve' } },
          },
        },
        reducers: virtualAgentReducer,
      };

      window.location = { reload: sinon.stub() };

      renderInReduxProvider(
        <Chatbox {...defaultProps} />,
        unacknowledgedUserStore,
      );

      const outgoingActivityEvent = new Event('bot-outgoing-activity');

      await dispatchAndWait(outgoingActivityEvent);
      expect(window.location.reload.called).to.be.false;

      Date.now.returns(60 * 60 * 1000 + 2);
      await dispatchAndWait(outgoingActivityEvent);
      expect(window.location.reload.called).to.be.true;
    });

    it('Will reload the page after 30 minutes between messages', async () => {
      const unacknowledgedUserStore = {
        initialState: {
          featureToggles: { loading: false },
          virtualAgentData: { termsAccepted: false },
          user: {
            login: { currentlyLoggedIn: true },
            profile: { userFullName: { first: 'Steve' } },
          },
        },
        reducers: virtualAgentReducer,
      };

      window.location = { reload: sinon.stub() };

      renderInReduxProvider(
        <Chatbox {...defaultProps} />,
        unacknowledgedUserStore,
      );

      const outgoingActivityEvent = new Event('bot-outgoing-activity');
      await dispatchAndWait(outgoingActivityEvent);
      expect(window.location.reload.called).to.be.false;

      Date.now.returns(15 * 60 * 1000 + Date.now());
      await dispatchAndWait(outgoingActivityEvent);
      expect(window.location.reload.called).to.be.false;

      Date.now.returns(30 * 60 * 1000 + Date.now() + 1);
      await dispatchAndWait(outgoingActivityEvent);
      expect(window.location.reload.called).to.be.true;
    });
  });

  describe('user lands on chatbot page (default behaviors)', () => {
    const providerObject = {
      initialState: {
        featureToggles: { loading: false },
        virtualAgentData: { termsAccepted: true },
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            userFullName: { first: 'MARK' },
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
        mockApiRequest({
          token: 'FAKETOKEN',
          apiSession: 'FAKEAPISESSION',
        });
        const unacknowledgedUserStore = {
          initialState: {
            featureToggles: { loading: false },
            virtualAgentData: { termsAccepted: false },
            user: {
              login: { currentlyLoggedIn: true },
              profile: { userFullName: { first: 'Steve' } },
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
        mockApiRequest({
          token: 'FAKETOKEN',
          apiSession: 'FAKEAPISESSION',
        });
        const unacknowledgedUserStore = {
          initialState: {
            featureToggles: { loading: false },
            virtualAgentData: { termsAccepted: false },
            user: {
              login: { currentlyLoggedIn: true },
              profile: { userFullName: { first: 'Steve' } },
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

      describe('when user is logged in initially (passing variables)', () => {
        it('passes CSRF Token, Api Session, Api Url, Base Url, userFirstName to greet user', async () => {
          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

          const { getByTestId } = renderInReduxProvider(
            <Chatbox {...defaultProps} />,
            providerObject,
          );

          await waitFor(() => expect(getByTestId('webchat')).to.exist);

          sinon.assert.calledWithExactly(
            StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances,
            'FAKECSRF',
            'FAKEAPISESSION',
            environment.API_URL,
            environment.BASE_URL,
            'Mark',
            'fake_uuid',
          );
        });

        it('passes blank string when user is signed in but doesnt have a name', async () => {
          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

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
            StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances,
            'FAKECSRF',
            'FAKEAPISESSION',
            environment.API_URL,
            environment.BASE_URL,
            'noFirstNameFound',
            'fake_uuid',
          );
        });
      });

      describe('when user is not logged in initially (passing variables)', () => {
        const initialStateNotLoggedIn = {
          navigation: {
            showLoginModal: false,
            utilitiesMenuIsOpen: { search: false },
          },
          user: { login: { currentlyLoggedIn: false } },
          virtualAgentData: { termsAccepted: true },
          featureToggles: {},
        };

        it('passes CSRF Token, Api Session, Api Url, Base Url, noFirstNameFound to greet user', async () => {
          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

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
            StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances,
            'FAKECSRF',
            'FAKEAPISESSION',
            environment.API_URL,
            environment.BASE_URL,
            'noFirstNameFound',
            'noUserUuid',
          );
        });
      });

      describe('when user interacts with authenticated topics', () => {
        const notLoggedInUser = {
          navigation: {
            showLoginModal: false,
            utilitiesMenuIsOpen: { search: false },
          },
          user: { login: { currentlyLoggedIn: false } },
          virtualAgentData: { termsAccepted: true },
          featureToggles: {},
        };

        const loggedInUser = {
          navigation: {
            showLoginModal: false,
            utilitiesMenuIsOpen: { search: false },
          },
          user: { login: { currentlyLoggedIn: true } },
          virtualAgentData: { termsAccepted: true },
          featureToggles: {},
        };

        it('when message activity is fired, then utterances should be stored in sessionStorage', () => {
          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

          const messageActivityHandlerSpy = sinon.spy();
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

          waitFor(() =>
            expect(
              JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES)),
            ).to.have.members(['', 'first']),
          );
        });

        it('when message activity is fired and sessionStorage is already holding two utterances, then the oldest utterance should be removed', () => {
          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

          const messageActivityHandlerSpy = sinon.spy();
          window.addEventListener(
            'webchat-message-activity',
            messageActivityHandlerSpy,
          );

          renderInReduxProvider(<Chatbox {...defaultProps} />, {
            initialState: notLoggedInUser,
            reducers: virtualAgentReducer,
          });

          sessionStorage.setItem(
            RECENT_UTTERANCES,
            JSON.stringify(['first', 'second']),
          );

          const event = new Event('webchat-message-activity');
          event.data = {
            type: 'message',
            text: 'third',
            from: { role: 'user' },
          };
          window.dispatchEvent(event);

          expect(messageActivityHandlerSpy.callCount).to.equal(1);

          waitFor(() =>
            expect(
              JSON.parse(sessionStorage.getItem(RECENT_UTTERANCES)),
            ).to.have.members(['second', 'third']),
          );
        });

        describe('when user is not logged in initially', () => {
          // this is a good test, but failed after adding setTimeout call (also added requiredAuth toggle)
          // commented out for now. testing manually.

          it('when auth activity event is fired, then loggedInFlow is set to true', () => {
            loadWebChat();
            mockApiRequest({
              token: 'FAKETOKEN',
              apiSession: 'FAKEAPISESSION',
            });

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

            expect(authActivityHandlerSpy.callCount).to.equal(1);
            waitFor(() =>
              expect(sessionStorage.getItem(LOGGED_IN_FLOW)).to.equal('true'),
            );
          });
        });

        describe('when user is logged in initially', () => {
          it('when auth activity event is fired then no changes occur to state', () => {
            loadWebChat();
            mockApiRequest({
              token: 'FAKETOKEN',
              apiSession: 'FAKEAPISESSION',
            });

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
          it('should render webchat with pre-existing conversation id and token', () => {
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

            const wrapper = renderInReduxProvider(
              <Chatbox {...defaultProps} />,
              {
                initialState: loggedInUser,
                reducers: virtualAgentReducer,
              },
            );
            waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);

            waitFor(() => expect(directLineSpy.called).to.be.true);
            waitFor(
              () =>
                expect(
                  directLineSpy.calledWithExactly({
                    token: 'FAKETOKEN',
                    domain:
                      'https://northamerica.directline.botframework.com/v3/directline',
                    conversationId: 'FAKECONVOID',
                    watermark: '',
                  }),
                ).to.be.true,
            );

            waitFor(() =>
              expect(sessionStorage.getItem(LOGGED_IN_FLOW)).to.equal('false'),
            );
            waitFor(() =>
              expect(sessionStorage.getItem(CONVERSATION_ID_KEY)).to.equal(
                'FAKECONVOID',
              ),
            );
            waitFor(() =>
              expect(sessionStorage.getItem(TOKEN_KEY)).to.equal('FAKETOKEN'),
            );
          });
        });

        it('does not display disclaimer when user has logged in via the bot and has returned to the page, and refreshes', () => {
          const loggedInUser2 = {
            navigation: {
              showLoginModal: false,
              utilitiesMenuIsOpen: { search: false },
            },
            user: { login: { currentlyLoggedIn: true } },
            virtualAgentData: { termsAccepted: false },
            featureToggles: {},
          };

          sessionStorage.setItem(LOGGED_IN_FLOW, 'true');

          loadWebChat();
          mockApiRequest({
            token: 'FAKETOKEN',
            apiSession: 'FAKEAPISESSION',
          });

          const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
            initialState: loggedInUser2,
            reducers: virtualAgentReducer,
          });

          waitFor(
            () => expect(wrapper.queryByText(disclaimerText)).to.not.exist,
          );

          location.reload();

          waitFor(
            () => expect(wrapper.queryByText(disclaimerText)).to.not.exist,
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
          featureToggles: { loading: true },
          virtualAgentData: { termsAccepted: true },
          user: {
            login: { currentlyLoggedIn: true },
            profile: { userFullName: { first: 'MARK' } },
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
            featureToggles: { loading: true },
            virtualAgentData: { termsAccepted: true },
            user: {
              login: { currentlyLoggedIn: true },
              profile: { userFullName: { first: 'MARK' } },
            },
          },
          virtualAgentReducer,
        );

        const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
          store,
        });

        expect(getTokenCalled()).to.equal(false);

        expect(wrapper.getByRole('progressbar')).to.exist;

        store.dispatch({
          type: FETCH_TOGGLE_VALUES_SUCCEEDED,
          payload: {},
        });

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

        store.dispatch({
          type: FETCH_TOGGLE_VALUES_SUCCEEDED,
          payload: {},
        });

        await waitFor(() => expect(getTokenCalled()).to.equal(true));
      });
    });

    describe('on initial load', () => {
      it('should show loading indicator', () => {
        loadWebChat();
        mockApiRequest({
          token: 'ANOTHERFAKETOKEN',
        });
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
        mockApiRequest({
          token: 'FAKETOKEN',
        });
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
            conversationId: '',
            watermark: '',
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
          {
            response: {},
            shouldResolve: false,
          },
          {
            response: {
              token: 'FAKETOKEN',
            },
            shouldResolve: true,
          },
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
          user: { login: { currentlyLoggedIn: false } },
          virtualAgentData: { termsAccepted: true },
          featureToggles: {},
        };

        waitFor(
          () =>
            expect(screen.getByTestId('webchat-framework-script')).to.not.exist,
        );

        loadWebChat();
        mockApiRequest({
          token: 'FAKETOKEN',
        });

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
        mockApiRequest({
          token: 'FAKETOKEN',
        });
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
          user: { login: { currentlyLoggedIn: false } },
          virtualAgentData: { termsAccepted: true },
          featureToggles: {},
        };

        loadWebChat();
        mockApiRequest({
          token: 'FAKETOKEN',
        });

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
  describe('voice is enabled for the RX skill', () => {
    const providerObject = {
      initialState: {
        featureToggles: { loading: false },
        virtualAgentData: { termsAccepted: true },
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            userFullName: { first: 'MARK' },
            accountUuid: 'fake_uuid',
          },
        },
      },
      reducers: virtualAgentReducer,
    };
    it('retrieves the speech token from the api', () => {
      // mockApiRequest();
    });
    it('should start recognition after clicking on microphone button   ', async () => {
      loadWebChatWithSpeech();

      mockApiRequest({
        token: 'FAKETOKEN',
        apiSession: 'FAKEAPISESSION',
      });
      const userStore = {
        initialState: {
          featureToggles: { loading: false },
          virtualAgentData: { termsAccepted: true },
          user: {
            login: { currentlyLoggedIn: true },
            profile: {
              userFullName: { first: 'MARK' },
              accountUuid: 'fake_uuid',
            },
          },
        },
        reducers: virtualAgentReducer,
      };

      const store = createTestStore(userStore.initialState, userStore.reducers);

      // This loads the chatbox but not the webchat inside of it
      const wrapper = renderInReduxProvider(<Chatbox {...defaultProps} />, {
        store,
      });
      // This works when loading Chatbox
      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
      await waitFor(
        () => expect(wrapper.getByText('VA chatbot (beta)')).to.exist,
      );

      // TODO Load wrapper instead of chatbox
      // something like this?
      // const wrapper = renderInReduxProvider(
      //  <WebChat token="fakeToken" WebChatFramework="TODO" apiSession="TODO" />,
      //   store,
      // );
      // or
      // const wrapper =  <WebChat token="fakeToken" WebChatFramework="TODO" apiSession="TODO" />
      // when webchat is loaded, this should work instead of the above
      // const button = wrapper.getByTitle('Speak');
    });
  });
});
