import { expect } from 'chai';
import sinon from 'sinon';
import * as ActionHelpersModule from '../../../webchat/utils/actions';
import StartConvoAndTrackUtterances from '../../../webchat/utils/startConvoAndTrackUtterances';

describe('startConvoAndTrackUtterances', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('makeBotStartConvoAndTrackUtterances', () => {
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

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances()(
        store,
      )(nextSpy)(action);

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

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances()(
        store,
      )(nextSpy)(action);

      expect(processSendMessageActivityStub.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call addActivityData for an unknown event', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'unknown' };

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances()(
        store,
      )(nextSpy)(action);

      expect(addActivityDataSpy.calledOnce).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });
    it('should call addActivityData for a known event', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'WEB_CHAT/SET_DICTATE_STATE' };

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances()(
        store,
      )(nextSpy)(action);

      expect(addActivityDataSpy.calledOnce).to.be.true;
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

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances()(
        store,
      )(nextSpy)(action);

      expect(processActionConnectFulfilledStub.notCalled).to.be.true;
      expect(processIncomingActivityStub.notCalled).to.be.true;
      expect(processSendMessageActivityStub.notCalled).to.be.true;
      expect(nextSpy.calledOnce).to.be.true;
    });

    it('should block WEB_CHAT/SEND_MESSAGE when frozen (no processing, no next)', async () => {
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

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        freezeRef: { current: true },
      })(store)(nextSpy)(action);

      expect(processSendMessageActivityStub.notCalled).to.be.true;
      expect(addActivityDataSpy.notCalled).to.be.true;
      expect(nextSpy.notCalled).to.be.true;
    });

    it('should block DIRECT_LINE/POST_ACTIVITY when frozen (no processing, no next)', async () => {
      const store = { dispatch: 'fake-dispatch' };
      const nextSpy = sinon.spy();
      const action = { type: 'DIRECT_LINE/POST_ACTIVITY' };

      const processIncomingActivityStub = sandbox.spy();
      sandbox
        .stub(
          ActionHelpersModule,
          ActionHelpersModule.processIncomingActivity.name,
        )
        .returns(processIncomingActivityStub);

      const addActivityDataSpy = sandbox.spy(
        ActionHelpersModule,
        'addActivityData',
      );

      await StartConvoAndTrackUtterances.makeBotStartConvoAndTrackUtterances({
        freezeRef: { current: true },
      })(store)(nextSpy)(action);

      expect(processIncomingActivityStub.notCalled).to.be.true;
      expect(addActivityDataSpy.notCalled).to.be.true;
      expect(nextSpy.notCalled).to.be.true;
    });
  });
});
