import { expect } from 'chai';
import sinon from 'sinon';
import { formatISO } from 'date-fns';
import * as actions from './actions';
import * as services from '../../services/referral';
import * as errorUtils from '../../utils/error';
import * as referralUtils from '../utils/referrals';

describe('referral actions', () => {
  let sandbox;
  let dispatch;
  let getState;
  let clock;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatch = sandbox.spy();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'Date'],
    });
    getState = () => ({
      referral: {
        pollingRequestStart: formatISO(new Date(Date.now() - 500)),
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('createDraftReferralAppointment', () => {
    it('should dispatch success flow', async () => {
      const mockResponse = { foo: 'bar' };
      sandbox
        .stub(services, 'postDraftReferralAppointment')
        .resolves(mockResponse);

      const result = await actions.createDraftReferralAppointment('ref-id')(
        dispatch,
      );

      expect(dispatch.firstCall.args[0].type).to.equal(
        actions.CREATE_DRAFT_REFERRAL_APPOINTMENT,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: actions.CREATE_DRAFT_REFERRAL_APPOINTMENT_SUCCEEDED,
        data: mockResponse,
      });
      expect(result).to.deep.equal(mockResponse);
    });

    it('should dispatch failure flow', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox
        .stub(services, 'postDraftReferralAppointment')
        .rejects(new Error('fail'));

      await actions.createDraftReferralAppointment('ref-id')(dispatch);

      expect(
        dispatch.calledWithMatch({
          type: actions.CREATE_DRAFT_REFERRAL_APPOINTMENT_FAILED,
        }),
      ).to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });
  });

  describe('fetchProviderDetails', () => {
    it('should dispatch success flow', async () => {
      const mockDetails = { name: 'Dr. Who' };
      sandbox.stub(services, 'getProviderById').resolves(mockDetails);

      const result = await actions.fetchProviderDetails('prov-id')(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        actions.FETCH_PROVIDER_DETAILS,
      );
      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: actions.FETCH_PROVIDER_DETAILS_SUCCEEDED,
        data: mockDetails,
      });
      expect(result).to.deep.equal(mockDetails);
    });

    it('should dispatch failure flow', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox.stub(services, 'getProviderById').rejects(new Error('fail'));

      await actions.fetchProviderDetails('prov-id')(dispatch);

      expect(
        dispatch.calledWithMatch({
          type: actions.FETCH_PROVIDER_DETAILS_FAILED,
        }),
      ).to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });
  });

  describe('fetchReferrals', () => {
    it('should dispatch success flow with filtered referrals', async () => {
      const referrals = [
        { id: 1, categoryOfCare: 'Physical Therapy' },
        { id: 2 },
      ];
      const filtered = [{ id: 1, categoryOfCare: 'Physical Therapy' }];
      sandbox.stub(services, 'getPatientReferrals').resolves(referrals);
      sandbox.stub(referralUtils, 'filterReferrals').returns(filtered);

      const result = await actions.fetchReferrals()(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(actions.FETCH_REFERRALS);

      expect(dispatch.secondCall.args[0]).to.deep.equal({
        type: actions.FETCH_REFERRALS_SUCCEEDED,
        data: filtered,
      });
      expect(result).to.deep.equal(referrals);
    });

    it('should dispatch failure flow', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox.stub(services, 'getPatientReferrals').rejects(new Error('fail'));

      await actions.fetchReferrals()(dispatch);

      expect(dispatch.calledWithMatch({ type: actions.FETCH_REFERRALS_FAILED }))
        .to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });
  });

  describe('createReferralAppointment', () => {
    it('should dispatch success flow', async () => {
      const mockAppointment = { confirmation: true };
      sandbox
        .stub(services, 'postReferralAppointment')
        .resolves(mockAppointment);

      const result = await actions.createReferralAppointment({
        referralId: 'r1',
        slotId: 's1',
        draftApppointmentId: 'd1',
      })(dispatch);

      expect(dispatch.firstCall.args[0].type).to.equal(
        actions.CREATE_REFERRAL_APPOINTMENT,
      );
      expect(dispatch.secondCall.args[0].type).to.equal(
        actions.CREATE_REFERRAL_APPOINTMENT_SUCCEEDED,
      );
      expect(result).to.deep.equal(mockAppointment);
    });

    it('should dispatch failure flow', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox
        .stub(services, 'postReferralAppointment')
        .rejects(new Error('fail'));

      await actions.createReferralAppointment({
        referralId: 'r1',
        slotId: 's1',
        draftApppointmentId: 'd1',
      })(dispatch);

      expect(
        dispatch.calledWithMatch({
          type: actions.CREATE_REFERRAL_APPOINTMENT_FAILED,
        }),
      ).to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });
  });

  describe('pollFetchAppointmentInfo', () => {
    it('should retry if status is draft', async () => {
      const pollSpy = sandbox.spy(actions, 'pollFetchAppointmentInfo');
      sandbox.stub(services, 'getAppointmentInfo').resolves({
        appointment: { status: 'draft' },
      });

      await actions.pollFetchAppointmentInfo('a1', {})(dispatch, getState);

      expect(dispatch.firstCall.args[0].type).to.equal(
        actions.FETCH_REFERRAL_APPOINTMENT_INFO,
      );
      clock.tick(1000);
      expect(pollSpy.calledOnce).to.be.true;
    });

    it('should dispatch success if status is confirmed', async () => {
      const info = { appointment: { status: 'booked' } };
      sandbox.stub(services, 'getAppointmentInfo').resolves(info);

      const result = await actions.pollFetchAppointmentInfo('a2', {})(
        dispatch,
        getState,
      );

      expect(
        dispatch.calledWithMatch({
          type: actions.FETCH_REFERRAL_APPOINTMENT_INFO_SUCCEEDED,
        }),
      ).to.be.true;
      expect(result).to.deep.equal(info);
    });

    it('should dispatch failure on error', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      sandbox.stub(services, 'getAppointmentInfo').rejects(new Error('fail'));

      await actions.pollFetchAppointmentInfo('a3', {})(dispatch, getState);

      expect(
        dispatch.calledWithMatch({
          type: actions.FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
        }),
      ).to.be.true;
      expect(captureStub.calledOnce).to.be.true;
    });

    it('should dispatch timeout failure if over timeout', async () => {
      const captureStub = sandbox.stub(errorUtils, 'captureError');
      const longGetState = () => ({
        referral: {
          pollingRequestStart: formatISO(new Date(Date.now() - 31000)),
        },
      });

      await actions.pollFetchAppointmentInfo('a4', {})(dispatch, longGetState);

      expect(
        dispatch.calledWithMatch({
          type: actions.FETCH_REFERRAL_APPOINTMENT_INFO_FAILED,
          payload: true,
        }),
      ).to.be.true;

      expect(captureStub.calledOnce).to.be.true;
    });
  });
});
