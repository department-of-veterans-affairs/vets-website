import { expect } from 'chai';
import reducer from './reducers';
import {
  SET_FORM_CURRENT_PAGE,
  SET_SELECTED_SLOT_START_TIME,
  SET_INIT_REFERRAL_FLOW,
} from './actions';

describe('ccAppointmentReducer', () => {
  it('should set the current page', () => {
    const state = reducer(undefined, {
      type: SET_FORM_CURRENT_PAGE,
      payload: 'review',
    });
    expect(state.currentPage).to.equal('review');
  });

  it('should handle SET_SELECTED_SLOT_START_TIME', () => {
    const state = reducer(undefined, {
      type: SET_SELECTED_SLOT_START_TIME,
      payload: 'slot-123',
    });
    expect(state.selectedSlotStartTime).to.equal('slot-123');
  });

  it('should handle SET_INIT_REFERRAL_FLOW and reset part of the state', () => {
    const modifiedState = {
      ...reducer(undefined, {}),
      appointmentInfoTimeout: true,
      appointmentInfoError: true,
      appointmentInfoLoading: true,
      referralAppointmentInfo: { foo: 'bar' },
      selectedSlotStartTime: 'something',
    };

    const state = reducer(modifiedState, { type: SET_INIT_REFERRAL_FLOW });

    expect(state.appointmentInfoTimeout).to.be.false;
    expect(state.appointmentInfoError).to.be.false;
    expect(state.appointmentInfoLoading).to.be.false;
    expect(state.referralAppointmentInfo).to.deep.equal({});
    expect(state.selectedSlotStartTime).to.equal('');
  });
});
