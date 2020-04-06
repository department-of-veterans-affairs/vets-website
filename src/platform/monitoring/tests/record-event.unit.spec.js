import _ from 'platform/utilities/data';

import recordEvent, { recordEventOnce } from '../record-event';

describe('recordEvent', () => {
  const oldWindow = global.window;

  beforeEach(() => {
    global.window = {
      dataLayer: [],
    };
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  test('should record events to the data layer', () => {
    const e = { event: 'foo-bar', contextualData: 'text' };
    recordEvent(e);
    expect(global.window.dataLayer.includes(e)).toBe(true);
  });
});

describe('recordEventOnce', () => {
  beforeEach(() => {
    window.oldDataLayer = _.cloneDeep(window.dataLayer);
    window.dataLayer = [];
  });

  afterEach(() => {
    window.dataLayer = _.cloneDeep(window.oldDataLayer);
    delete window.oldDataLayer;
  });

  const testKey = 'help-text-label';
  const testEvent = {
    event: 'test-event',
    [testKey]: 'Test Event',
  };

  test('should record event if not already in dataLayer', () => {
    // sanity check to ensure that setup worked
    expect(window.dataLayer.length).toBe(0);

    recordEventOnce(testEvent, testKey);
    expect(window.dataLayer.length).toBe(1);
  });

  test('should not record duplicate events', () => {
    // sanity check to ensure that setup worked
    expect(window.dataLayer.length).toBe(0);

    recordEventOnce(testEvent, testKey);
    recordEventOnce(testEvent, testKey);

    expect(window.dataLayer.length).toBe(1);
  });
});
