import * as RecordEventModule from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { expect } from 'chai';
import { describe } from 'mocha';
import sinon from 'sinon';
import handleTelemetry from '../../../webchat/utils/telemetry';

describe('tracking', () => {
  let sandbox;
  let clock;
  const now = new Date();

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('handleTelemetry', () => {
    it('should  call recordEvent when a user submits a message', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      const event = {
        name: 'submitSendBox',
      };

      const recordEventData = {
        event: 'cta-button-click',
        'button-type': 'default',
        'button-click-label': 'submitSendBox',
        'button-background-color': 'gray',
        time: now,
      };

      handleTelemetry(event);

      expect(recordEventStub.calledOnce).to.be.true;
      expect(recordEventStub.firstCall.args[0]).to.deep.equal(recordEventData);
    });
    it('should  call recordEvent when a user submits a message', () => {
      const recordEventStub = sandbox.stub(RecordEventModule, 'default');

      const event = {
        name: 'other-event',
      };

      handleTelemetry(event);

      expect(recordEventStub.notCalled).to.be.true;
    });
  });
});
