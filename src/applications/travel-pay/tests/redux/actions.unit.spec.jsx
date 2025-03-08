import { expect } from 'chai';
import sinon from 'sinon';

import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import {
  getTravelClaims,
  getAppointmentData,
  submitMileageOnlyClaim,
} from '../../redux/actions';

const mockAppt = {
  start: '2024-12-30T14:00:00Z',
  localStartTime: '2024-12-30T08:00:00.000-06:00',
  location: {
    id: '983',
    type: 'appointments',
    attributes: {
      name: 'Cheyenne VA Medical Center',
    },
  },
};

describe('Redux - actions', () => {
  let apiStub;

  beforeEach(() => {
    apiStub = sinon.stub(api, 'apiRequest');
  });
  afterEach(() => {
    apiStub.restore();
  });

  describe('Travel Claims', () => {
    it('should call correct actions for GET travel claims success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ data: { message: 'success!' } });

      await getTravelClaims()(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_SUCCESS' }),
      ).to.be.true;
    });

    it('should call correct actions for GET travel claims failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('nope'));

      await getTravelClaims()(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_FAILURE' }),
      ).to.be.true;
    });
  });

  describe('Appointments', () => {
    it('should call correct actions for GET appointments success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ data: { attributes: { ...mockAppt } } });

      await getAppointmentData(123)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_APPOINTMENT_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_APPOINTMENT_SUCCESS' }),
      ).to.be.true;
    });

    it('should call correct actions for GET appointments failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('nope'));

      await getAppointmentData(123)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_APPOINTMENT_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_APPOINTMENT_FAILURE' }),
      ).to.be.true;
    });
  });

  describe('Submit Claim', () => {
    it('should call correct actions for claim submission success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('nope'));

      await submitMileageOnlyClaim('2024-05-26T16:40:45.781Z')(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_STARTED' })).to
        .be.true;
      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_FAILURE' })).to
        .be.true;
    });

    it('should call correct actions for claim submission failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ claimId: '1234' });

      await submitMileageOnlyClaim('2024-05-26T16:40:45.781Z')(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_STARTED' })).to
        .be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'SUBMIT_CLAIM_SUCCESS',
          payload: { claimId: '1234' },
        }),
      ).to.be.true;
    });
  });
});
