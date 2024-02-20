import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { describe } from 'mocha';
import { recordRxSession } from '../../../../components/webchat/helpers/tracking';

const sandbox = sinon.createSandbox();

describe('recordRxSession', () => {
  afterEach(() => {
    sandbox.restore();
  });
  it('should call recordEvent when a user enters the prescription skill', () => {
    const recordEventStub = sandbox.stub(recordEventObject, 'default');

    const recordEventData = {
      event: 'api_call',
      'api-name': 'Enter Chatbot Rx Skill',
      'api-status': 'successful',
    };
    const isRxSkill = 'true';
    recordRxSession(isRxSkill);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
  });
  it('should not call recordEvent when a user is not inside prescription skill', () => {
    const recordEventStub = sandbox.stub(recordEventObject, 'default');

    const isRxSkill = 'false';
    recordRxSession(isRxSkill);

    expect(recordEventStub.notCalled).to.be.true;
  });
});
