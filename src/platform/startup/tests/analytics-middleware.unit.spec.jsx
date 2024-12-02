import { expect } from 'chai';
import { spy } from 'sinon';

import createAnalyticsMiddleware from '../analytics-middleware';

let oldPush;
let oldDataLayer;

describe('Analytics Middleware', () => {
  beforeEach(() => {
    oldPush = global.window.push;
    oldDataLayer = global.window.dataLayer;
    global.window.push = spy();
    global.window.dataLayer = [];
  });

  afterEach(() => {
    global.window.push = oldPush;
    global.window.dataLayer = oldDataLayer;
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

  it('should capture the proper events', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    middleware({})(() => {})({ type: 'test-string-event' });
    expect(global.window.dataLayer).to.eql([
      { event: 'first-string-event-name' },
    ]);
  });

  it('should handle function events', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    // Tests that both store and action are passed to the event callback
    middleware({ basePayload: 'some ' })(() => {})({
      type: 'test-function-event',
      payload: 'stuff',
    });
    middleware({})(() => {})({ type: 'test-function-event' });
    expect(global.window.dataLayer).to.eql([
      { event: 'some stuff' },
      { event: 'no-payload' },
    ]);
  });

  it('should call the next middleware', () => {
    const middleware = createAnalyticsMiddleware(eventList);
    const nextSpy = spy();
    middleware({})(nextSpy)({ type: 'test-string-event' });
    expect(nextSpy.called).to.equal(true);
  });
});
