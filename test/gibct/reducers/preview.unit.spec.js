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

    expect(state.display).to.be.eql(true);
    expect(state.version).to.be.eql(1);
  });

  it('should exit preview mode', () => {
    const state = previewReducer(
      { display: true },
      {
        type: 'EXIT_PREVIEW_MODE',
      }
    );

    expect(state.display).to.be.eql(false);
    expect(state.version).to.be.eql({});
  });

  it('should set version correctly', () => {
    const state = previewReducer(
      initialState,
      {
        type: 'SET_VERSION',
        version: 2
      }
    );

    expect(state.display).to.be.eql(false);
    expect(state.version).to.be.eql(2);
  });
});
