import { expect } from 'chai';
import reducer from './reducers';
import {
  SET_FORM_CURRENT_PAGE,
  FETCH_REFERRAL_APPOINTMENT_INFO,
  FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
  FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
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

  it('should handle FETCH_REFERRAL_APPOINTMENT_INFO', () => {
    const state = reducer(undefined, {
      type: FETCH_REFERRAL_APPOINTMENT_INFO,
      payload: { pollingRequestStart: 'now' },
    });
    expect(state.appointmentInfoLoading).to.be.true;
    expect(state.pollingRequestStart).to.equal('now');
  });

  it('should handle FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED', () => {
    const info = { id: 'abc123' };
    const state = reducer(undefined, {
      type: FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
      data: info,
    });
    expect(state.appointmentInfoLoading).to.be.false;
    expect(state.referralAppointmentInfo).to.deep.equal(info);
  });

  it('should handle FETCH_REFERRAL_APPOINTMENT_INFO_FAILED', () => {
    const state = reducer(undefined, {
      type: FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
      payload: true,
    });
    expect(state.appointmentInfoLoading).to.be.false;
    expect(state.appointmentInfoError).to.be.true;
    expect(state.appointmentInfoTimeout).to.be.true;
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
