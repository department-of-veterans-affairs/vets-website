import { expect } from 'chai';
import sinon from 'sinon';

import recordEvent, { recordEventOnce } from '../record-event';

describe('recordEvent', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  it('should call bt("track") with the event name and properties', () => {
    recordEvent({ event: 'foo-bar', 'context-data': 'text' });
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[0]).to.equal('track');
    expect(btStub.firstCall.args[1]).to.equal('foo-bar');
    expect(btStub.firstCall.args[2]).to.deep.include({ contextData: 'text' });
  });

  it('should fire eventCallback after tracking', () => {
    const callback = sinon.stub().returns('callback-result');
    const result = recordEvent({
      event: 'foo-bar',
      eventCallback: callback,
    });
    expect(callback.calledOnce).to.be.true;
    expect(result).to.equal('callback-result');
  });

  it('should fire eventCallback even when bt is not available', () => {
    global.window.bt = undefined;
    const callback = sinon.stub().returns('fallback');
    const result = recordEvent({
      event: 'foo-bar',
      eventCallback: callback,
    });
    expect(callback.calledOnce).to.be.true;
    expect(result).to.equal('fallback');
  });

  it('should not throw when bt is not available', () => {
    global.window.bt = undefined;
    expect(() => recordEvent({ event: 'test' })).to.not.throw();
  });
});

describe('recordEventOnce', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  const testKey = 'help-text-label';
  const testEvent = {
    event: 'test-event',
    [testKey]: 'Test Event',
  };

  it('should record event on first call', () => {
    recordEventOnce(testEvent, testKey);
    expect(btStub.calledOnce).to.be.true;
  });

  it('should not record duplicate events', () => {
    // The first call from the previous test already recorded it,
    // but since recordedEvents is a module-level Set, we just verify
    // the deduplication behavior with a fresh event.
    const uniqueEvent = {
      event: 'unique-test',
      'unique-key': 'unique-value-123',
    };
    recordEventOnce(uniqueEvent, 'unique-key');
    const callCountAfterFirst = btStub.callCount;

    recordEventOnce(uniqueEvent, 'unique-key');
    expect(btStub.callCount).to.equal(callCountAfterFirst);
  });
});
