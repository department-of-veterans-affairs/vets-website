import _ from 'platform/utilities/data';
import { expect } from 'chai';

import recordEvent, { recordEventOnce } from '../record-event';

describe('recordEvent', () => {
  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      dataLayer: [],
    });
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should record events to the data layer', () => {
    const e = { event: 'foo-bar', contextualData: 'text' };
    recordEvent(e);
    expect(global.window.dataLayer.includes(e)).to.be.true;
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

  it('should record event if not already in dataLayer', () => {
    // sanity check to ensure that setup worked
    expect(window.dataLayer.length).to.equal(0);

    recordEventOnce(testEvent, testKey);
    expect(window.dataLayer.length).to.equal(1);
  });

  it('should not record duplicate events', () => {
    // sanity check to ensure that setup worked
    expect(window.dataLayer.length).to.equal(0);

    recordEventOnce(testEvent, testKey);
    recordEventOnce(testEvent, testKey);

    expect(window.dataLayer.length).to.equal(1);
  });
});
