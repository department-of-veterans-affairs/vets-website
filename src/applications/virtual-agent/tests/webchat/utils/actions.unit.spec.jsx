import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  addActivityData,
  processActionConnectFulfilled,
  processIncomingActivity,
  processSendMessageActivity,
} from '../../../webchat/utils/actions';
import * as EventsModule from '../../../webchat/utils/events';
import * as ProcessCSATModule from '../../../webchat/utils/processCSAT';
import * as SessionStorageModule from '../../../webchat/utils/sessionStorage';
import * as SubmitFormModule from '../../../webchat/utils/submitForm';

describe('actions', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('processActionConnectFulfilled', () => {
    it('should call dispatch once', () => {
      const dispatchSpy = sandbox.spy();
      const options = {
        dispatch: dispatchSpy,
        isMobile: true,
      };

      processActionConnectFulfilled(options)();

      expect(dispatchSpy.calledOnce).to.be.true;
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
    it('should set event skill value and record Skill Entry for Skill_Entry action', () => {
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
      })();
      expect(setEventSkillValueStub.calledOnce).to.be.true;
      expect(setEventSkillValueStub.calledWithExactly('some_skill_value')).to.be
        .true;
      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot Skill Entry - some_skill_value',
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

    it('should call processCSAT when activity is CSATSurveyResponse', () => {
      const action = {
        payload: {
          activity: {
            valueType: 'CSATSurveyResponse',
          },
        },
      };

      const processCSATStub = sandbox.stub(ProcessCSATModule, 'default');
      const originalRAF = window.requestAnimationFrame;
      const originalGlobalRAF = global.requestAnimationFrame;
      window.requestAnimationFrame = cb => cb();
      global.requestAnimationFrame = cb => cb();

      processIncomingActivity({
        action,
        dispatch: sandbox.spy(),
      })();

      expect(processCSATStub.calledOnce).to.be.true;
      window.requestAnimationFrame = originalRAF;
      global.requestAnimationFrame = originalGlobalRAF;
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

    it('should emit RAG Agent Entry on RAG_ENTRY for non-RootBot skill', () => {
      const action = {
        payload: {
          activity: {
            type: 'event',
            name: 'Rag_Entry',
            value: { value: 'some_skill_value' },
          },
        },
      };
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot RAG Agent Entry - some_skill_value',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });

    it('should emit RAG Agent Entry for RootBot RAG_ENTRY', () => {
      const action = {
        payload: {
          activity: {
            type: 'event',
            name: 'Rag_Entry',
            value: { value: 'RootBot' },
          },
        },
      };
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot RAG Agent Entry - RootBot',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });

    it('should emit RAG Agent Exit on RAG_EXIT for non-RootBot skill', () => {
      const action = {
        payload: {
          activity: {
            type: 'event',
            name: 'Rag_Exit',
            value: 'some_skill_value',
          },
        },
      };
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      // And explicit RAG Agent Exit
      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot RAG Agent Exit - some_skill_value',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });

    it('should emit RAG Agent Exit on RAG_EXIT for RootBot', () => {
      const action = {
        payload: {
          activity: {
            type: 'event',
            name: 'Rag_Exit',
            value: 'RootBot',
          },
        },
      };
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      processIncomingActivity({ action, dispatch: sandbox.spy() })();

      expect(
        recordEventStub.calledWithExactly({
          event: 'api_call',
          'api-name': 'Chatbot RAG Agent Exit - RootBot',
          'api-status': 'successful',
        }),
      ).to.be.true;
    });
  });

  describe('addActivityData', () => {
    const action = {
      payload: {
        activity: {
          value: 'fake-value',
        },
      },
    };
    const updatedAction = addActivityData(action, {
      isMobile: 'isMobile',
    });
    expect(updatedAction.payload.activity.value).to.deep.equal({
      value: 'fake-value',
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
      isMobile: 'isMobile',
    });
    expect(updatedAction.payload.activity.value).to.deep.equal({
      language: 'en-US',
      isMobile: 'isMobile',
    });
  });
});
