import { expect } from 'chai';

import previewReducer from '../../../src/js/gi/reducers/preview.js';

const initialState = {
  display: false,
  version: {}
};

describe('preview reducer', () => {
  it('should enter preview mode', () => {
    const state = previewReducer(
      initialState,
      {
        type: 'ENTER_PREVIEW_MODE',
        version: 1
      }
    );

    expect(state.display).to.be.eq(true);
    expect(state.version).to.be.eq(1);
  });

  it('should exit preview mode', () => {
    const state = previewReducer(
      { display: true },
      {
        type: 'EXIT_PREVIEW_MODE',
      }
    );

    expect(state.display).to.be.eq(false);
    expect(state.version).to.eql({});
  });

  it('should set version correctly', () => {
    const state = previewReducer(
      initialState,
      {
        type: 'SET_VERSION',
        version: 2
      }
    );

    expect(state.display).to.be.eq(false);
    expect(state.version).to.be.eq(2);
  });
});
