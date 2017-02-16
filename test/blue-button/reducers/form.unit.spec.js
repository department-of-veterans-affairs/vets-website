import { expect } from 'chai';

import form from '../../../src/js/blue-button/reducers/form';

describe('Form reducer', () => {
  it('should set redirect to true on form success', () => {
    const state = form(undefined, {
      type: 'FORM_SUCCESS'
    });

    expect(state.ui.redirect).to.be.true;
  });
  it('should set redirect to true on form success', () => {
    const state = form(undefined, {
      type: 'FORM_FAILURE'
    });

    expect(state.ui.redirect).to.be.false;
  });
});
