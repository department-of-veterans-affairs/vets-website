import { expect } from 'chai';

import alertReducer from '../../../src/js/rx/reducers/alert.js';

describe('alert reducer', () => {
  it('should open the alert', () => {
    const state = {
      visible: false
    };
    const newState = alertReducer(state, { type: 'OPEN_ALERT' });
    expect(newState.visible).to.be.true;
  });
});
