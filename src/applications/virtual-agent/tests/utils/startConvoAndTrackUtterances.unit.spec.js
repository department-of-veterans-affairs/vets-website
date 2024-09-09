import { expect } from 'chai';
import sinon from 'sinon';
import StartConvoAndTrackUtterances from '../../utils/startConvoAndTrackUtterances';
import * as ActionHelpersModule from '../../utils/actions';

describe('startConvoAndTrackUtterances', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('makeBotStartConvoAndTrackUtterances', () => {
    it('should call processActionConnectFulfilled when action is DIRECT_LINE/CONNECT_FULFILLED', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'DIRECT_LINE/CONNECT_FULFILLED' };

      const processActionConnectFulfilledStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processActionConnectFulfilled.name,
        )
        .returns(processActionConnectFulfilledStub);

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(nextSpy)(action);

      expect(processActionConnectFulfilledStub.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call processIncomingActivity when action is DIRECT_LINE/INCOMING_ACTIVITY', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'DIRECT_LINE/INCOMING_ACTIVITY' };

      const processIncomingActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processIncomingActivity.name,
        )
        .returns(processIncomingActivityStub);

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(nextSpy)(action);

      expect(processIncomingActivityStub.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call procesSendMessageActivity when action is WEB_CHAT/SEND_MESSAGE', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'WEB_CHAT/SEND_MESSAGE' };

      const processSendMessageActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processSendMessageActivity.name,
        )
        .returns(processSendMessageActivityStub);

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(nextSpy)(action);

      expect(processSendMessageActivityStub.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call processMicrophoneActivity when action is WEB_CHAT/SET_DICTATE_STATE', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'WEB_CHAT/SET_DICTATE_STATE' };

      const processMicrophoneActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processMicrophoneActivity.name,
        )
        .returns(processMicrophoneActivityStub);

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(nextSpy)(action);

      expect(processMicrophoneActivityStub.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should not call addActivityData for an unknown event if root-bot toggle off', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'unknown' };

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        csrfToken: 'csrfToken',
        apiSession: 'apiSession',
        apiURL: 'apiURL',
        baseURL: 'baseURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isRootBotToggleOn: false,
      })(store)(nextSpy)(action);

      expect(addActivityDataSpy.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call addActivityData for an unknown event if root-bot toggle on', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'unknown' };

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        csrfToken: 'csrfToken',
        apiSession: 'apiSession',
        apiURL: 'apiURL',
        baseURL: 'baseURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isRootBotToggleOn: true,
      })(store)(nextSpy)(action);

      expect(addActivityDataSpy.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call addActivityData for a known event if root-bot toggle on', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'WEB_CHAT/SET_DICTATE_STATE' };

      sandbox.stub(
        ActionHelpersModule,
        ActionHelpersModule.processMicrophoneActivity.name,
      );

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        csrfToken: 'csrfToken',
        apiSession: 'apiSession',
        apiURL: 'apiURL',
        baseURL: 'baseURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isRootBotToggleOn: true,
      })(store)(nextSpy)(action);

      expect(addActivityDataSpy.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should not call addActivityData for a known event if root-bot toggle off', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'WEB_CHAT/SET_DICTATE_STATE' };

      sandbox.stub(
        ActionHelpersModule,
        ActionHelpersModule.processMicrophoneActivity.name,
      );

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        csrfToken: 'csrfToken',
        apiSession: 'apiSession',
        apiURL: 'apiURL',
        baseURL: 'baseURL',
        userFirstName: 'userFirstName',
        userUuid: 'userUuid',
        isRootBotToggleOn: false,
      })(store)(nextSpy)(action);

      expect(addActivityDataSpy.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should not call any of the process function when action is unknown', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'OTHER' };

      const processActionConnectFulfilledStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processActionConnectFulfilled.name,
        )
        .returns(processActionConnectFulfilledStub);

      const processIncomingActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processIncomingActivity.name,
        )
        .returns(processIncomingActivityStub);

      const processSendMessageActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processSendMessageActivity.name,
        )
        .returns(processSendMessageActivityStub);

      const processMicrophoneActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processMicrophoneActivity.name,
        )
        .returns(processMicrophoneActivityStub);

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances(
        'csrfToken',
        'apiSession',
        'apiURL',
        'baseURL',
        'userFirstName',
        'userUuid',
      )(store)(nextSpy)(action);

      expect(processActionConnectFulfilledStub.notCalled).to.be.true;
      expect(processIncomingActivityStub.notCalled).to.be.true;
      expect(processSendMessageActivityStub.notCalled).to.be.true;
      expect(processMicrophoneActivityStub.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
  });
});
