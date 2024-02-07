import { expect } from 'chai';
import sinon from 'sinon';
import * as recordEventObject from 'platform/monitoring/record-event';
import { describe } from 'mocha';
import {
  recordButtonClick,
  recordRxSession,
} from '../../../../components/webchat/helpers/tracking';
import { IS_RX_SKILL } from '../../../../components/chatbox/utils';

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
describe('recordButtonClick', () => {
  afterEach(() => {
    sandbox.restore();
  });
  it('should call recordEvent when a user clicks a quickReply button with undefined topic when not in Rx skill', () => {
    const recordEventStub = sandbox.stub(recordEventObject, 'default');
    const recordEventData = {
      event: 'chatbot-button-click',
      clickText: 'Mock Button Text',
      topic: undefined,
    };
    const mockButtonClickEvent = {
      target: {
        classList: {
          contains(className) {
            return this.value.split(' ').includes(className);
          },
          value: 'webchat__suggested-action',
        },
        innerText: 'Mock Button Text',
      },
    };
    recordButtonClick(mockButtonClickEvent);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
  });
  it('should call recordEvent when a user clicks a quickReply button with prescriptions topic when in Rx skill', () => {
    sessionStorage.setItem(IS_RX_SKILL, 'true');

    const recordEventStub = sandbox.stub(recordEventObject, 'default');

    const recordEventData = {
      event: 'chatbot-button-click',
      clickText: 'Mock Button Text',
      topic: 'prescriptions',
    };
    const mockButtonClickEvent = {
      target: {
        classList: {
          contains(className) {
            return this.value.split(' ').includes(className);
          },
          value: 'webchat__suggested-action',
        },
        innerText: 'Mock Button Text',
      },
    };
    recordButtonClick(mockButtonClickEvent);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
  });
  it('should call recordEvent when a user clicks a quickReply button text span with prescriptions topic when in Rx skill', () => {
    sessionStorage.setItem(IS_RX_SKILL, 'true');

    const recordEventStub = sandbox.stub(recordEventObject, 'default');

    const recordEventData = {
      event: 'chatbot-button-click',
      clickText: 'Mock Button Text',
      topic: 'prescriptions',
    };
    const mockButtonClickEvent = {
      target: {
        classList: {
          contains(className) {
            return this.value.split(' ').includes(className);
          },
          value: 'webchat__suggested-action__text',
        },
        innerText: 'Mock Button Text',
      },
    };
    recordButtonClick(mockButtonClickEvent);

    expect(recordEventStub.calledOnce).to.be.true;
    expect(recordEventStub.firstCall.args[0]).to.eql(recordEventData);
  });
  it('should not call recordEvent when a user clicks a button without the correct CSS class', () => {
    sessionStorage.setItem(IS_RX_SKILL, 'true');

    const recordEventStub = sandbox.stub(recordEventObject, 'default');

    const mockButtonClickEvent = {
      target: {
        classList: {
          contains(className) {
            return this.value.split(' ').includes(className);
          },
          value: 'unrecognized_classname',
        },
        innerText: 'Mock Button Text',
      },
    };
    recordButtonClick(mockButtonClickEvent);

    expect(recordEventStub.notCalled).to.be.true;
    expect(recordEventStub.firstCall).to.equal(null);
  });
});
