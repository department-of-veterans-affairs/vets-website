import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StartConvoAndTrackUtterances from '../../../components/webchat/startConvoAndTrackUtterances';

describe('makeBotStartConvoAndTrackUtterances actions', () => {
  // mock store
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let fakeNext;
  let store;
  const connectFulfilledAction = { type: 'DIRECT_LINE/CONNECT_FULFILLED' };
  const connectSendMessage = {
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: { text: 'some@email.com' },
  };
  const directIncomingActivity = {
    type: 'DIRECT_LINE/INCOMING_ACTIVITY',
    payload: { activity: 'some activity' },
  };

  beforeEach(() => {
    fakeNext = sinon.stub();
    store = mockStore({});
  });

  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" startConversationActivity dispatch', async () => {
    // invoke startConvoAndTrackUtterances with proper curried values
    await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
    )(store)(fakeNext)(connectFulfilledAction);
    // fake the session storage using stubs

    const actions = store.getActions();
    expect(actions.length).to.equal(2);
    expect(fakeNext.callCount).to.equal(1);

    expect(actions[0].payload.activity).to.own.include({
      name: 'startConversation',
    });
    expect(actions[0]).to.own.include({ type: 'DIRECT_LINE/POST_ACTIVITY' });
  });

  it('should correctly handle "DIRECT_LINE/CONNECT_FULFILLED" joinActivity dispatch', async () => {
    await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
    )(store)(fakeNext)(connectFulfilledAction);

    const actions = store.getActions();
    expect(actions.length).to.equal(2);
    expect(fakeNext.callCount).to.equal(1);

    expect(actions[1]).to.own.include({ type: 'WEB_CHAT/SEND_EVENT' });
    expect(actions[1].payload).to.own.include({ name: 'webchat/join' });
  });

  describe('Handling of "DIRECT_LINE/INCOMING_ACTIVITY"', () => {
    const IS_TRACKING_UTTERANCES = 'va-bot.isTrackingUtterances';
    const IN_AUTH_EXP = 'va-bot.inAuthExperience';
    const RECENT_UTTERANCES = 'va-bot.recentUtterances';
    const sandbox = sinon.createSandbox();
    beforeEach(() => {
      sessionStorage.clear();
    });
    afterEach(() => {
      sessionStorage.clear();
      sandbox.restore();
    });
    it("should correctly begin tracking utterances if it hasn't yet", async () => {
      // setup
      // fire/execute
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(directIncomingActivity);
      // tests
      const isTrackingUtterances = await sessionStorage.getItem(
        IS_TRACKING_UTTERANCES,
      );
      expect(isTrackingUtterances).to.equal('true');
    });

    it('Stops tracking utterances when about to redirect to sign in', async () => {
      // setup
      const activity = {
        type: 'message',
        text: 'Alright. Sending you to the sign in page...',
        from: { role: 'bot' },
      };
      const aboutToSignInActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      const spyDispatchEvent = sandbox.spy(window, 'dispatchEvent');

      // fire
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(aboutToSignInActivity);
      // tests
      const isTrackingUtterances = await sessionStorage.getItem(
        IS_TRACKING_UTTERANCES,
      );
      const authEvent = spyDispatchEvent.firstCall.args[0];
      expect(sessionStorage.length).to.equal(1);
      expect(isTrackingUtterances).to.equal('false');
      expect(spyDispatchEvent.callCount).to.equal(1);
      expect(authEvent.data).to.equal(activity);
      expect(authEvent.type).to.equal('webchat-auth-activity');
    });

    it('Sends message activity when utterances are tracked', async () => {
      const spyDispatchEvent = sandbox.spy(window, 'dispatchEvent');
      const activity = {
        type: 'message',
        text: 'Hello',
        from: { role: 'user' },
      };
      const incomingActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      sessionStorage.setItem(IS_TRACKING_UTTERANCES, 'true');

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(incomingActivity);

      const messageEvent = spyDispatchEvent.firstCall.args[0];
      expect(sessionStorage.length).to.equal(1);
      expect(spyDispatchEvent.callCount).to.equal(1);
      expect(messageEvent.data).to.equal(activity);
      expect(messageEvent.type).to.equal('webchat-message-activity');
    });

    it('Initiates the resumption of a conversation post authentication', async () => {
      // setup
      const activity = {
        type: 'message',
        text: 'To get started...',
        from: { role: 'bot' },
      };
      sessionStorage.setItem(IN_AUTH_EXP, 'true');
      sessionStorage.setItem(
        RECENT_UTTERANCES,
        JSON.stringify(['first', 'second']),
      );
      const aboutToSignInActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      const spyDispatchActivity = sandbox.spy(store, 'dispatch');

      // fire
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(aboutToSignInActivity);

      // tests

      // one of the IFs not under test sets 1 value of session storage
      expect(sessionStorage.length).to.equal(3);
      expect(sessionStorage.getItem(RECENT_UTTERANCES)).to.equal('[]');
      expect(spyDispatchActivity.firstCall.args[0]).to.eql({
        type: 'WEB_CHAT/SEND_MESSAGE',
        payload: {
          type: 'message',
          text: 'first',
        },
      });
    });
  });

  it('should correctly handle "WEB_CHAT/SEND_MESSAGE"', async () => {
    await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
    )(store)(fakeNext)(connectSendMessage);

    const actions = store.getActions();
    expect(actions.length).to.equal(0);
    expect(fakeNext.callCount).to.equal(1);

    expect(fakeNext.firstCall.args[0].payload).to.own.include({
      text: '****',
    });
  });
});
