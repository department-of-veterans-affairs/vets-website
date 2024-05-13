import sinon from 'sinon';
import { expect } from 'chai';
import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  processActionConnectFulfilled,
  processMicrophoneActivity,
  processIncomingActivity,
  processSendMessageActivity,
} from '../../utils/actions';
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as EventsModule from '../../utils/events';

describe('actions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('processActionConnectFulfilled', () => {
    it('should call dispatch twice', () => {
      const dispatchSpy = sandbox.spy();
      const options = {
        dispatch: dispatchSpy,
        csrfToken: 'csrfToken',
        apiSession: 'apiSession',
        apiURL: 'apiUrl',
        baseURL: 'baseUrl',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isMobile: true,
      };

      processActionConnectFulfilled(options)();

      expect(dispatchSpy.calledTwice).to.be.true;
    });
  });
  describe('processSendMessageActivity', () => {
    it('should dispatch the bot-outgoing-activity event', () => {
      const action = {
        payload: {
          text: 'text',
        },
      };
      const dispatchStub = sandbox.stub(window, 'dispatchEvent');

      processSendMessageActivity({ action })();

      expect(dispatchStub.calledOnce).to.be.true;
    });
  });
  describe('processIncomingActivity', () => {
    it('should set tracking utterances to true if at the beginning of the conversation', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'text',
            from: {
              role: 'bot',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(false);

      const setIsTrackingUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setIsTrackingUtterances',
      );

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      expect(setIsTrackingUtterancesStub.calledOnce).to.be.true;
      expect(setIsTrackingUtterancesStub.calledWithExactly(true)).to.be.true;
    });
    it('should not set tracking utterances if not at the beginning of the conversation', () => {
      const action = {
        payload: {
          activity: {
            type: 'other',
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);

      const setIsTrackingUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setIsTrackingUtterances',
      );

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      expect(setIsTrackingUtterancesStub.notCalled).to.be.true;
    });
    it('should set tracking utterances to false if the bot wants to sign in the user', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Alright. Sending you to the sign-in page...',
            from: {
              role: 'bot',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);

      const dispatch = sandbox.stub();
      const setIsTrackingUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setIsTrackingUtterances',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsTrackingUtterancesStub.calledOnce).to.be.true;
      expect(setIsTrackingUtterancesStub.calledWithExactly(false)).to.be.true;
    });
    it('should reset utterances if it is a newly authed conversation and utterances already exist', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'To get started',
            from: {
              role: 'bot',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns('true');
      sandbox
        .stub(SessionStorageModule, 'getRecentUtterances')
        .returns(['utterance1', 'utterance2']);

      const dispatch = sandbox.stub();
      const setRecentUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setRecentUtterances',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setRecentUtterancesStub.calledOnce).to.be.true;
      expect(setRecentUtterancesStub.calledWithExactly([])).to.be.true;
    });
    it('should not reset utterances if it is a newly authed conversation but utterances dont exist', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'To get started',
            from: {
              role: 'bot',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns('true');
      sandbox
        .stub(SessionStorageModule, 'getRecentUtterances')
        .returns(undefined);

      const dispatch = sandbox.stub();
      const setRecentUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setRecentUtterances',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setRecentUtterancesStub.notCalled).to.be.true;
    });
    it('should not change tracking utterances or reset utterances if not signing in or a new authed conversation', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'bot',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns('false');

      const dispatch = sandbox.stub();
      const setIsTrackingUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setIsTrackingUtterances',
      );
      const setRecentUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setRecentUtterances',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsTrackingUtterancesStub.notCalled).to.be.true;
      expect(setRecentUtterancesStub.notCalled).to.be.true;
    });
    it('should not change tracking utterances or reset utterances if not a message from the bot', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns('false');

      const dispatch = sandbox.stub();
      const setIsTrackingUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setIsTrackingUtterances',
      );
      const setRecentUtterancesStub = sandbox.stub(
        SessionStorageModule,
        'setRecentUtterances',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsTrackingUtterancesStub.notCalled).to.be.true;
      expect(setRecentUtterancesStub.notCalled).to.be.true;
    });
    it('should send a webchat-message-activity event if tracking utterances', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
          },
        },
      };

      sandbox
        .stub(SessionStorageModule, 'getIsTrackingUtterances')
        .returns(true);
      sandbox.stub(SessionStorageModule, 'getInAuthExp').returns('false');

      const dispatch = sandbox.stub();
      const sendWindowEventWithActionPayloadStub = sandbox.stub(
        EventsModule,
        'sendWindowEventWithActionPayload',
      );

      processIncomingActivity({ action, dispatch })();

      expect(sendWindowEventWithActionPayloadStub.calledOnce).to.be.true;
      expect(
        sendWindowEventWithActionPayloadStub.calledWithExactly(
          'webchat-message-activity',
          action,
        ),
      ).to.be.true;
    });
    it('should set is rx skill to true and trigger rxSkill event if entering rx', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Skill_Entry',
            value: 'RX_Skill',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setIsRxSkillStub = sandbox.stub(
        SessionStorageModule,
        'setIsRxSkill',
      );
      const sendWindowEventWithActionPayloadStub = sandbox.stub(
        EventsModule,
        'sendWindowEventWithActionPayload',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsRxSkillStub.calledOnce).to.be.true;
      expect(setIsRxSkillStub.calledWithExactly(true)).to.be.true;
      expect(
        sendWindowEventWithActionPayloadStub.calledWithExactly(
          'rxSkill',
          action,
        ),
      ).to.be.true;
    });
    it('should not set is rx skill if entering non-rx skill', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Skill_Entry',
            value: 'Other_Skill',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setIsRxSkillStub = sandbox.stub(
        SessionStorageModule,
        'setIsRxSkill',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsRxSkillStub.notCalled).to.be.true;
    });
    it('should set is rx skill to false and trigger rxSkill event if exiting rx', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Skill_Exit',
            value: 'RX_Skill',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setIsRxSkillStub = sandbox.stub(
        SessionStorageModule,
        'setIsRxSkill',
      );
      const sendWindowEventWithActionPayloadStub = sandbox.stub(
        EventsModule,
        'sendWindowEventWithActionPayload',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsRxSkillStub.calledOnce).to.be.true;
      expect(setIsRxSkillStub.calledWithExactly(false)).to.be.true;
      expect(
        sendWindowEventWithActionPayloadStub.calledWithExactly(
          'rxSkill',
          action,
        ),
      ).to.be.true;
    });
    it('should not set is rx skill if exiting non-rx skill', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Skill_Exit',
            value: 'Other_Skill',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setIsRxSkillStub = sandbox.stub(
        SessionStorageModule,
        'setIsRxSkill',
      );

      processIncomingActivity({ action, dispatch })();

      expect(setIsRxSkillStub.notCalled).to.be.true;
    });
  });
  describe('processMicrophoneActivity', () => {
    it('should call recordEvent when enabling the microphone for prescriptions', () => {
      const action = {
        payload: {
          dictateState: 3,
        },
      };

      const recordEventStub = sandbox.stub(RecordEventModule, 'default');
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns(true);

      processMicrophoneActivity({ action })();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'chatbot-microphone-enable',
          topic: 'prescriptions',
        }),
      ).to.be.true;
    });
    it('should call recordEvent when enabling the microphone for non-prescriptions', () => {
      const action = {
        payload: {
          dictateState: 3,
        },
      };

      const recordEventStub = sandbox.stub(RecordEventModule, 'default');
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns(false);

      processMicrophoneActivity({ action })();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'chatbot-microphone-enable',
          topic: undefined,
        }),
      ).to.be.true;
    });
    it('should call recordEvent when disabling the microphone for prescriptions', () => {
      const action = {
        payload: {
          dictateState: 0,
        },
      };

      const recordEventStub = sandbox.stub(RecordEventModule, 'default');
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns(true);

      processMicrophoneActivity({ action })();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'chatbot-microphone-disable',
          topic: 'prescriptions',
        }),
      ).to.be.true;
    });
    it('should call recordEvent when disabling the microphone for non-prescriptions', () => {
      const action = {
        payload: {
          dictateState: 0,
        },
      };

      const recordEventStub = sandbox.stub(RecordEventModule, 'default');
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns(false);

      processMicrophoneActivity({ action })();

      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'chatbot-microphone-disable',
          topic: undefined,
        }),
      ).to.be.true;
    });
    it('should not call recordEvent for other microphone events', () => {
      const action = {
        payload: {
          dictateState: 1000,
        },
      };

      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processMicrophoneActivity({ action })();

      expect(recordEventStub.notCalled).to.be.true;
    });
  });
});
