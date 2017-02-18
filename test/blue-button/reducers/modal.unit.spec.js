import { expect } from 'chai';

import modalReducer from '../../../src/js/blue-button/reducers/modal';

describe('Modal reducer', () => {
  it('should close modal', () => {
    const state = modalReducer(undefined, {
      type: 'GLOSSARY_MODAL_CLOSED'
    });

    expect(state.visible).to.be.false;
  });

  it('should open modal', () => {
    const state = modalReducer(undefined, {
      type: 'GLOSSARY_MODAL_OPENED',
      title: 'Title',
      content: 'Content'
    });

    expect(state.visible).to.be.true;
    expect(state.title).to.equal('Title');
    expect(state.content).to.equal('Content');
  });
});

