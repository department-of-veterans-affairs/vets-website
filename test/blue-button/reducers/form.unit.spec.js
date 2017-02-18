import { expect } from 'chai';

import formReducer from '../../../src/js/blue-button/reducers/form';

describe('Form reducer', () => {
  it('should set the start date', () => {
    const state = formReducer(undefined, {
      type: 'START_DATE_CHANGED',
      date: 'start date'
    });

    expect(state.dateRange.start).to.equal('start date');
  });

  it('should set the end date', () => {
    const state = formReducer(undefined, {
      type: 'END_DATE_CHANGED',
      date: 'end date'
    });

    expect(state.dateRange.end).to.equal('end date');
  });

  it('should set the date option', () => {
    const state = formReducer(undefined, {
      type: 'DATE_OPTION_CHANGED',
      dateOption: '1yr'
    });

    expect(state.dateOption).to.equal('1yr');
  });

  it('should set redirect to true on form success', () => {
    const state = formReducer(undefined, {
      type: 'FORM_SUCCESS'
    });

    expect(state.ui.redirect).to.be.true;
  });

  it('should set redirect to true on form success', () => {
    const state = formReducer(undefined, {
      type: 'FORM_FAILURE'
    });

    expect(state.ui.redirect).to.be.false;
  });
});
