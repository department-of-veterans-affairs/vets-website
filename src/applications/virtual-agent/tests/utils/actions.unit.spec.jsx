import sinon from 'sinon';
import { expect } from 'chai';
import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import {
  processActionConnectFulfilled,
  processMicrophoneActivity,
  processIncomingActivity,
  processSendMessageActivity,
  addActivityData,
} from '../../utils/actions';
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as EventsModule from '../../utils/events';
import * as SubmitFormModule from '../../utils/submitForm';
import * as ProcessCSATModule from '../../utils/processCSAT';

describe('actions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('processActionConnectFulfilled', () => {
    it('should call dispatch once when root bot toggle is on', () => {
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
        isRootBotToggleOn: true,
      };

      processActionConnectFulfilled(options)();

      expect(dispatchSpy.calledOnce).to.be.true;
    });
    it('should call dispatch once when root bot toggle is off', () => {
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
        isRootBotToggleOn: false,
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
            value: 'va_vha_healthassistant_bot',
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
    it('should set event skill value and call recordEvent for Skill_Entry action when root bot toggle is on', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Skill_Entry',
            value: {
              value: 'some_skill_value',
            },
          },
        },
      };

      const dispatch = sandbox.stub();
      const setEventSkillValueStub = sandbox.stub(
        SessionStorageModule,
        'setEventSkillValue',
      );
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({
        action,
        dispatch,
        isRootBotToggleOn: true,
      })();
      expect(setEventSkillValueStub.calledOnce).to.be.true;
      expect(setEventSkillValueStub.calledWithExactly('some_skill_value')).to.be
        .true;
      expect(recordEventStub.calledOnce).to.be.true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot Skill Entry - some_skill_value',
          topic: 'some_skill_value',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });
    it('should not set event skill value or call recordEvent for non-Skill_Entry action', () => {
      const action = {
        payload: {
          activity: {
            type: 'message',
            text: 'Other',
            from: {
              role: 'user',
            },
            name: 'Other_Action',
            value: 'some_value',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setEventSkillValueStub = sandbox.stub(
        SessionStorageModule,
        'setEventSkillValue',
      );
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch })();
      expect(setEventSkillValueStub.notCalled).to.be.true;
      expect(recordEventStub.notCalled).to.be.true;
    });
    it('should not set event skill value to null if not a Skill_Exit event', () => {
      const action = {
        payload: {
          activity: {
            type: 'event',
            from: {
              role: 'bot',
            },
            name: 'Other_Action',
            value: 'some_skill_value',
          },
        },
      };

      const dispatch = sandbox.stub();
      const setEventSkillValueStub = sandbox.stub(
        SessionStorageModule,
        'setEventSkillValue',
      );
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch })();
      expect(setEventSkillValueStub.notCalled).to.be.true;
      expect(recordEventStub.notCalled).to.be.true;
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
            value: 'va_vha_healthassistant_bot',
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

    it('should call submitForm when activity is FormPostButton and component toggle is on', () => {
      const url = 'https://test.com/';
      const body = {
        field1: 'value1',
        field2: 'value2',
      };
      const action = {
        payload: {
          activity: {
            type: 'message',
            value: {
              type: 'FormPostButton',
              url,
              body,
            },
          },
        },
      };

      const submitFormStub = sandbox.stub(SubmitFormModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
        isComponentToggleOn: true,
      })();

      expect(submitFormStub.calledOnce).to.be.true;
      expect(submitFormStub.calledWithExactly(url, body)).to.be.true;
    });

    it('should not call submitForm when activity is FormPostButton and component toggle is off', () => {
      const action = {
        payload: {
          activity: {
            value: {
              type: 'FormPostButton',
            },
          },
        },
      };

      const submitFormStub = sandbox.stub(SubmitFormModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
        isComponentToggleOn: false,
      })();

      expect(submitFormStub.notCalled).to.be.true;
    });

    it('should not call submitForm when activity is not FormPostButton', () => {
      const action = {
        payload: {
          activity: {
            value: {
              type: 'other',
            },
          },
        },
      };

      const submitFormStub = sandbox.stub(SubmitFormModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
      })();

      expect(submitFormStub.notCalled).to.be.true;
    });

    it('should call processCSAT when activity is CSATSurveyResponse and root bot toggle is on', () => {
      const action = {
        payload: {
          activity: {
            valueType: 'CSATSurveyResponse',
          },
        },
      };

      const processCSATStub = sandbox.stub(ProcessCSATModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
        isRootBotToggleOn: true,
      })();

      expect(processCSATStub.calledOnce).to.be.true;
    });

    it('should not call processCSAT when root bot toggle is off', () => {
      const action = {
        payload: {
          activity: {
            valueType: 'CSATSurveyResponse',
          },
        },
      };

      const processCSATStub = sandbox.stub(ProcessCSATModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
        isRootBotToggleOn: false,
      })();

      expect(processCSATStub.notCalled).to.be.true;
    });

    it('should not call processCSAT when activity is not CSATSurveyResponse', () => {
      const action = {
        payload: {
          activity: {
            valueType: 'other',
          },
        },
      };

      const processCSATStub = sandbox.stub(ProcessCSATModule, 'default');

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
      })();

      expect(processCSATStub.notCalled).to.be.true;
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
      sandbox
        .stub(SessionStorageModule, 'getEventSkillValue')
        .returns('prescriptions');

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
      sandbox
        .stub(SessionStorageModule, 'getEventSkillValue')
        .returns('prescriptions');

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

  describe('addActivityData', () => {
    it('should add values to the activity when value is a string', () => {
      const action = {
        payload: {
          activity: {
            value: 'fake-value',
          },
        },
      };
      const updatedAction = addActivityData(action, {
        apiSession: 'apiSession',
        csrfToken: 'csrfToken',
        apiURL: 'apiURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isMobile: 'isMobile',
      });
      expect(updatedAction.payload.activity.value).to.deep.equal({
        value: 'fake-value',
        apiSession: 'apiSession',
        csrfToken: 'csrfToken',
        apiURL: 'apiURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isMobile: 'isMobile',
      });
    });
    it('should add values to the activity when value is an object', () => {
      const action = {
        payload: {
          activity: {
            value: { language: 'en-US' },
          },
        },
      };
      const updatedAction = addActivityData(action, {
        apiSession: 'apiSession',
        csrfToken: 'csrfToken',
        apiURL: 'apiURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isMobile: 'isMobile',
      });
      expect(updatedAction.payload.activity.value).to.deep.equal({
        language: 'en-US',
        apiSession: 'apiSession',
        csrfToken: 'csrfToken',
        apiURL: 'apiURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isMobile: 'isMobile',
      });
    });
  });
});
