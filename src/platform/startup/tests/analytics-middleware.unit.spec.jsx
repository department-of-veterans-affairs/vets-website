import { expect } from 'chai';
import sinon, { spy } from 'sinon';

import createAnalyticsMiddleware from '../analytics-middleware';

describe('Analytics Middleware', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  const eventList = [
    {
      action: 'test-string-event',
      event: 'first-string-event-name',
    },
    {
      action: 'test-second-string-event',
      event: 'second-string-event-name',
    },
    {
      action: 'test-function-event',
      event: (store, action) => {
        if (action.payload) {
          return store.basePayload + action.payload;
        }

        return 'no-payload';
      },
    },
  ];

  it('should capture the proper events via bt("track")', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    middleware({})(() => {})({ type: 'test-string-event' });
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[0]).to.equal('track');
    expect(btStub.firstCall.args[1]).to.equal('first-string-event-name');
  });

  it('should handle function events', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    middleware({ basePayload: 'some ' })(() => {})({
      type: 'test-function-event',
      payload: 'stuff',
    });
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[1]).to.equal('some stuff');

    middleware({})(() => {})({ type: 'test-function-event' });
    expect(btStub.calledTwice).to.be.true;
    expect(btStub.secondCall.args[1]).to.equal('no-payload');
  });

  it('should call the next middleware', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    const nextSpy = spy();
    middleware({})(nextSpy)({ type: 'test-string-event' });
    expect(nextSpy.called).to.equal(true);
  });
});
