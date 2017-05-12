import { expect } from 'chai';

import modalsReducer from '../../../src/js/gi/reducers/modals.js';

const initialState = {
  displaying: null
};

describe('modals reducer', () => {
  it('should display modal correctly', () => {
    const state = modalsReducer(
      initialState,
      {
        type: 'DISPLAY_MODAL',
        modal: 'openModal',
      }
    );

    expect(state.displaying).to.be.eql('openModal');
  });

  it('should close modals when route is updated', () => {
    const state = modalsReducer(
      initialState,
      { type: 'UPDATE_ROUTE' }
    );

    expect(state.displaying).to.be.eql(null);
  });
});
