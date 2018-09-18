import { expect } from 'chai';

import modalReducer from '../../reducers/modal';

describe('modal reducer', () => {
  test('should close modal', () => {
    const state = modalReducer(undefined, {
      type: 'MODAL_CLOSED'
    });

    expect(state.visible).to.be.false;
  });

  test('should open modal', () => {
    const state = modalReducer(undefined, {
      type: 'MODAL_OPENED',
      title: 'Title',
      content: 'Content'
    });

    expect(state.visible).to.be.true;
    expect(state.title).to.equal('Title');
    expect(state.content).to.equal('Content');
  });
});
