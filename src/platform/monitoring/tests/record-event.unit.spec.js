import { expect } from 'chai';

import recordEvent from '../record-event';

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

  it('should record events to the data layer', () => {
    const e = { event: 'foo-bar', contextualData: 'text' };
    recordEvent(e);
    expect(global.window.dataLayer.includes(e)).to.be.true;
  });
});
