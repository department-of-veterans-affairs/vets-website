import { expect } from 'chai';

import modalReducer from '../../../src/js/rx/reducers/modal.js';

describe('modal reducer', () => {
  it('should open the refill modal', () => {
    const state = {
      visible: false,
      prescription: null
    };
    const newState = modalReducer(state, { type: 'OPEN_REFILL_MODAL' });
    expect(newState.refill.visible).to.be.true;
  });

  it('should close the refill modal', () => {
    const state = {
      visible: true,
      prescription: null
    };
    const newState = modalReducer(state, { type: 'CLOSE_REFILL_MODAL' });
    expect(newState.refill.visible).to.be.false;
  });

  it('should open the glossary modal', () => {
    const state = {
      visible: false,
      content: null
    };
    const newState = modalReducer(state, { type: 'OPEN_GLOSSARY_MODAL' });
    expect(newState.glossary.visible).to.be.true;
  });

  it('should close the glossary modal', () => {
    const state = {
      visible: true,
      content: null
    };
    const newState = modalReducer(state, { type: 'CLOSE_GLOSSARY_MODAL' });
    expect(newState.glossary.visible).to.be.false;
  });
});
