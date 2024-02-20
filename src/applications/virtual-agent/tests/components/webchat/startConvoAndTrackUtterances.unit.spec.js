import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StartConvoAndTrackUtterances from '../../../components/webchat/startConvoAndTrackUtterances';
import { IS_RX_SKILL } from '../../../components/chatbox/utils';

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
  const micEnableActivity = {
    type: 'WEB_CHAT/SET_DICTATE_STATE',
    payload: {
      dictateState: 3,
    },
  };
  const micDisableActivity = {
    type: 'WEB_CHAT/SET_DICTATE_STATE',
    payload: {
      dictateState: 0,
    },
  };

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    fakeNext = sinon.stub();
    store = mockStore({});
  });

  afterEach(() => {
    sandbox.restore();
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
    beforeEach(() => {
      sessionStorage.clear();
    });
    afterEach(() => {
      sessionStorage.clear();
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

    it('Stops tracking utterances when about to redirect to sign-in', async () => {
      // setup
      const activity = {
        type: 'message',
        text: 'Alright. Sending you to the sign-in page...',
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

  it('should dispatch an event "WEB_CHAT/SEND_MESSAGE"', async () => {
    const stubDispatchEvent = sandbox.stub(window, 'dispatchEvent');

    await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
      'csrfToken',
      'apiSession',
      'apiURL',
      'baseURL',
      'userFirstName',
      'userUuid',
    )(store)(fakeNext)(connectSendMessage);

    expect(stubDispatchEvent.firstCall.args[0].type).to.equal(
      'bot-outgoing-activity',
    );
  });
  describe('Checking the bot entered and exited the Rx skill', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });
    afterEach(() => {
      sessionStorage.clear();
    });
    it('should update the session storage RX key to true upon entering the RX skill and dispatch an RxSkill event', async () => {
      // setup
      // fire/execute
      const spyDispatchEvent = sandbox.spy(window, 'dispatchEvent');
      const activity = {
        type: 'event',
        name: 'Skill_Entry',
        value: 'RX_Skill',
        from: { role: 'bot' },
      };
      const rxActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(rxActivity);
      // tests
      const isRxSkillSessionStorageSet = await sessionStorage.getItem(
        IS_RX_SKILL,
      );
      // second call is for skill entry
      const entrySkillEvent = spyDispatchEvent.secondCall.args[0];
      expect(isRxSkillSessionStorageSet).to.equal('true');
      expect(entrySkillEvent.type).to.equal('rxSkill');
    });

    it('should update the session storage RX key to false upon exiting the RX skill and dispatch an RxSkill event ', async () => {
      const spyDispatchEvent = sandbox.spy(window, 'dispatchEvent');
      const activity = {
        type: 'event',
        name: 'Skill_Exit',
        value: 'RX_Skill',
        from: { role: 'bot' },
      };
      const rxActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(rxActivity);
      // tests
      const isRxSkillSessionStorageSet = await sessionStorage.getItem(
        IS_RX_SKILL,
      );
      // second call is for skill entry
      const entrySkillEvent = spyDispatchEvent.secondCall.args[0];
      expect(isRxSkillSessionStorageSet).to.equal('false');
      expect(entrySkillEvent.type).to.equal('rxSkill');
    });
    it('should not trigger rx skill session storage due to null event', async () => {
      const activity = {
        type: 'event',
        name: null,
        from: { role: 'bot' },
      };
      const rxActivity = {
        type: 'DIRECT_LINE/INCOMING_ACTIVITY',
        payload: { activity },
      };
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(rxActivity);
      // tests
      const isRxSkillSessionStorageSet = await sessionStorage.getItem(
        IS_RX_SKILL,
      );
      expect(isRxSkillSessionStorageSet).to.equal(null);
    });
    it('should pass isMobile=true to PVA', async () => {
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
        true,
      )(store)(fakeNext)(connectFulfilledAction);

      const actions = store.getActions();

      expect(actions[0].payload.activity.value).to.have.property('isMobile');
      expect(actions[0].payload.activity.value.isMobile).to.equal(true);
    });
    it('should pass isMobile=false to PVA', async () => {
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
        false,
      )(store)(fakeNext)(connectFulfilledAction);

      const actions = store.getActions();

      expect(actions[0].payload.activity.value).to.have.property('isMobile');
      expect(actions[0].payload.activity.value.isMobile).to.equal(false);
    });
  });

  describe('Handling of "WEB_CHAT/SET_DICTATE_STATE" for microphone tracking', () => {
    it('should record an event when the PVA Microphone is enabled', async () => {
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(micEnableActivity);

      expect(window.dataLayer[0].event).equal('chatbot-microphone-enable');
      expect(window.dataLayer[0].topic).equal(undefined);
    });

    it('should record an event when the PVA Microphone is disabled', async () => {
      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(micDisableActivity);

      expect(window.dataLayer[0].event).equal('chatbot-microphone-disable');
      expect(window.dataLayer[0].topic).equal(undefined);
    });

    it('should record an event when the PVA Microphone is enabled in Rx skill', async () => {
      sessionStorage.setItem(IS_RX_SKILL, 'true');

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(micEnableActivity);

      expect(window.dataLayer[0].event).equal('chatbot-microphone-enable');
      expect(window.dataLayer[0].topic).equal('prescriptions');
    });

    it('should record an event when the PVA Microphone is disabled in Rx skill', async () => {
      sessionStorage.setItem(IS_RX_SKILL, 'true');

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(fakeNext)(micDisableActivity);

      expect(window.dataLayer[0].event).equal('chatbot-microphone-disable');
      expect(window.dataLayer[0].topic).equal('prescriptions');
    });
  });
});
