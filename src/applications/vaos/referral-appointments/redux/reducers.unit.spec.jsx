import { expect } from 'chai';
import reducer from './reducers';
import { FETCH_STATUS } from '../../utils/constants';
import {
  SET_FORM_CURRENT_PAGE,
  CREATE_REFERRAL_APPOINTMENT,
  CREATE_REFERRAL_APPOINTMENT_FAILED,
  CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
  CREATE_DRAFT_REFERRAL_APPOINTMENT,
  CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED,
  CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED,
  FETCH_REFERRAL_APPOINTMENT_INFO,
  FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
  FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
  FETCH_REFERRALS,
  FETCH_REFERRALS_SUCCEEDED,
  FETCH_REFERRALS_FAILED,
  SET_SELECTED_SLOT,
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

  it('should handle CREATE_REFERRAL_APPOINTMENT', () => {
    const state = reducer(undefined, { type: CREATE_REFERRAL_APPOINTMENT });
    expect(state.appointmentCreateStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should handle CREATE_REFERRAL_APPOINTMENT_SUCCEEDED', () => {
    const state = reducer(undefined, {
      type: CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
    });
    expect(state.appointmentCreateStatus).to.equal(FETCH_STATUS.succeeded);
  });

  it('should handle CREATE_REFERRAL_APPOINTMENT_FAILED', () => {
    const state = reducer(undefined, {
      type: CREATE_REFERRAL_APPOINTMENT_FAILED,
    });
    expect(state.appointmentCreateStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should handle CREATE_DRAFT_REFERRAL_APPOINTMENT', () => {
    const state = reducer(undefined, {
      type: CREATE_DRAFT_REFERRAL_APPOINTMENT,
    });
    expect(state.draftAppointmentCreateStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should handle CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED', () => {
    const draftData = { note: 'Draft created' };
    const state = reducer(undefined, {
      type: CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED,
      data: draftData,
    });
    expect(state.draftAppointmentCreateStatus).to.equal(FETCH_STATUS.succeeded);
    expect(state.draftAppointmentInfo).to.deep.equal(draftData);
  });

  it('should handle CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED', () => {
    const state = reducer(undefined, {
      type: CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED,
    });
    expect(state.draftAppointmentCreateStatus).to.equal(FETCH_STATUS.failed);
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

  it('should handle FETCH_REFERRALS', () => {
    const state = reducer(undefined, { type: FETCH_REFERRALS });
    expect(state.referralsFetchStatus).to.equal(FETCH_STATUS.loading);
  });

  it('should handle FETCH_REFERRALS_SUCCEEDED', () => {
    const referrals = [{ id: 1 }, { id: 2 }];
    const state = reducer(undefined, {
      type: FETCH_REFERRALS_SUCCEEDED,
      data: referrals,
    });
    expect(state.referralsFetchStatus).to.equal(FETCH_STATUS.succeeded);
    expect(state.referrals).to.deep.equal(referrals);
  });

  it('should handle FETCH_REFERRALS_FAILED', () => {
    const state = reducer(undefined, { type: FETCH_REFERRALS_FAILED });
    expect(state.referralsFetchStatus).to.equal(FETCH_STATUS.failed);
  });

  it('should handle SET_SELECTED_SLOT', () => {
    const state = reducer(undefined, {
      type: SET_SELECTED_SLOT,
      payload: 'slot-123',
    });
    expect(state.selectedSlot).to.equal('slot-123');
  });

  it('should handle SET_INIT_REFERRAL_FLOW and reset part of the state', () => {
    const modifiedState = {
      ...reducer(undefined, {}),
      draftAppointmentInfo: { draft: true },
      draftAppointmentCreateStatus: FETCH_STATUS.succeeded,
      appointmentInfoTimeout: true,
      appointmentInfoError: true,
      appointmentInfoLoading: true,
      referralAppointmentInfo: { foo: 'bar' },
      selectedSlot: 'something',
    };

    const state = reducer(modifiedState, { type: SET_INIT_REFERRAL_FLOW });

    expect(state.draftAppointmentInfo).to.deep.equal({});
    expect(state.draftAppointmentCreateStatus).to.equal(
      FETCH_STATUS.notStarted,
    );
    expect(state.appointmentInfoTimeout).to.be.false;
    expect(state.appointmentInfoError).to.be.false;
    expect(state.appointmentInfoLoading).to.be.false;
    expect(state.referralAppointmentInfo).to.deep.equal({});
    expect(state.selectedSlot).to.equal('');
  });
});
