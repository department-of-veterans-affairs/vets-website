import { expect } from 'chai';
import sinon from 'sinon';

import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import {
  getTravelClaims,
  getClaimDetails,
  getAppointmentData,
  submitMileageOnlyClaim,
  createComplexClaim,
  submitComplexClaim,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../../redux/actions';
import { stripTZOffset } from '../../util/dates';

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

const mockDetails = {
  claimId: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
  claimNumber: 'TC0928098230498',
  claimStatus: 'Claim submitted',
  appointmentDate: '2024-05-26T16:40:45.781Z',
  facilityName: 'Tomah VA Medical Center',
  createdOn: '2024-05-27T16:40:45.781Z',
  modifiedOn: '2024-05-31T16:40:45.781Z',
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

      await getTravelClaims({
        label: 'Jan 2024 - Mar 2024',
        value: 'Q1_2024',
        start: '2024-01-01T00:00:00-06:00',
        end: '2024-03-31T23:59:59-05:00',
      })(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_TRAVEL_CLAIMS_SUCCESS',
          dateRangeId: 'Q1_2024',
        }),
      ).to.be.true;
    });

    it('should call correct actions for GET travel claims failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('nope'));

      await getTravelClaims({
        label: 'Jan 2024 - Mar 2024',
        value: 'Q1_2024',
        start: '2024-01-01T00:00:00-06:00',
        end: '2024-03-31T23:59:59-05:00',
      })(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_TRAVEL_CLAIMS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_TRAVEL_CLAIMS_FAILURE',
          dateRangeId: 'Q1_2024',
        }),
      ).to.be.true;
    });
  });

  describe('Claim details', () => {
    it('should call correct actions for GET claim detailss success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ mockDetails });

      await getClaimDetails('45678')(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_CLAIM_DETAILS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_CLAIM_DETAILS_SUCCESS' }),
      ).to.be.true;
    });

    it('should call correct actions for GET claim details failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('nope'));

      await getClaimDetails('45678')(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_CLAIM_DETAILS_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({ type: 'FETCH_CLAIM_DETAILS_FAILURE' }),
      ).to.be.true;
    });
  });

  describe('Appointments', () => {
    it('should call correct actions for GET appointments success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ data: { attributes: { ...mockAppt } } });

      await getAppointmentData('123')(mockDispatch);

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

      await getAppointmentData('123')(mockDispatch);

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

      // Create submission data from appointment data, just like SubmitFlowWrapper does
      const submissionData = {
        appointmentDateTime: stripTZOffset(mockAppt.localStartTime),
        facilityStationNumber: mockAppt.location.id,
        facilityName: mockAppt.location.attributes.name,
        appointmentType: 'Other',
        isComplete: false,
      };

      await submitMileageOnlyClaim(submissionData)(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_STARTED' })).to
        .be.true;
      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_FAILURE' })).to
        .be.true;
    });

    it('should call correct actions for claim submission failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ claimId: '1234' });

      // Create submission data from appointment data, just like SubmitFlowWrapper does
      const submissionData = {
        appointmentDateTime: stripTZOffset(mockAppt.localStartTime),
        facilityStationNumber: mockAppt.location.id,
        facilityName: mockAppt.location.attributes.name,
        appointmentType: 'Other',
        isComplete: false,
      };

      await submitMileageOnlyClaim(submissionData)(mockDispatch);

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

  describe('Create Complex Claim', () => {
    it('should call correct actions for create complex claim success', async () => {
      const mockDispatch = sinon.spy();
      const mockClaimData = { claimId: '12345' };
      apiStub.resolves(mockClaimData);

      // Create submission data from appointment data, just like the component does
      const submissionData = {
        appointmentDateTime: stripTZOffset(mockAppt.localStartTime),
        facilityStationNumber: mockAppt.location.id,
        facilityName: mockAppt.location.attributes.name,
        appointmentType: 'Other',
      };

      await createComplexClaim(submissionData)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'CREATE_COMPLEX_CLAIM_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'CREATE_COMPLEX_CLAIM_SUCCESS',
          payload: mockClaimData,
        }),
      ).to.be.true;
    });

    it('should call correct actions for create complex claim failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to create claim'));

      // Create submission data from appointment data
      const submissionData = {
        appointmentDateTime: stripTZOffset(mockAppt.localStartTime),
        facilityStationNumber: mockAppt.location.id,
        facilityName: mockAppt.location.attributes.name,
        appointmentType: 'Other',
      };

      await createComplexClaim(submissionData)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({ type: 'CREATE_COMPLEX_CLAIM_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'CREATE_COMPLEX_CLAIM_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });
  });

  describe('Submit Complex Claim', () => {
    it('should call correct actions for submit complex claim success', async () => {
      const mockDispatch = sinon.spy();
      const mockResponse = { claimId: '12345', status: 'submitted' };
      apiStub.resolves(mockResponse);

      const claimData = {
        claimId: '12345',
        expenses: [
          { expenseType: 'Mileage', amount: 50.25 },
          { expenseType: 'Parking', amount: 10.0 },
        ],
      };

      await submitComplexClaim(claimData)(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_STARTED' })).to
        .be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'SUBMIT_CLAIM_SUCCESS',
          payload: mockResponse,
        }),
      ).to.be.true;
    });

    it('should call correct actions for submit complex claim failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to submit claim'));

      const claimData = {
        claimId: '12345',
        expenses: [{ expenseType: 'Mileage', amount: 50.25 }],
      };

      await submitComplexClaim(claimData)(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'SUBMIT_CLAIM_STARTED' })).to
        .be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'SUBMIT_CLAIM_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });
  });

  describe('Expense Management', () => {
    describe('Create Expense', () => {
      it('should call correct actions for create expense success', async () => {
        const mockDispatch = sinon.spy();
        const mockExpense = {
          id: 'exp123',
          expenseType: 'Mileage',
          amount: 25.5,
        };
        apiStub.resolves(mockExpense);

        const expenseData = {
          expenseType: 'Mileage',
          tripType: 'OneWay',
          address: {
            addressLine1: '123 Main St',
            city: 'Denver',
            stateCode: 'CO',
            zipCode: '80202',
          },
        };

        await createExpense('claim123', 'mileage', expenseData)(mockDispatch);

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_SUCCESS',
            claimId: 'claim123',
            payload: mockExpense,
          }),
        ).to.be.true;
      });

      it('should call correct actions for create expense failure', async () => {
        const mockDispatch = sinon.spy();
        apiStub.rejects(new Error('Failed to create expense'));

        const expenseData = { expenseType: 'Parking', amount: 10.0 };

        await createExpense('claim123', 'parking', expenseData)(mockDispatch);

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_FAILURE',
            error: sinon.match.instanceOf(Error),
          }),
        ).to.be.true;
      });
    });

    describe('Update Expense', () => {
      it('should call correct actions for update expense success', async () => {
        const mockDispatch = sinon.spy();
        const mockUpdatedExpense = {
          id: 'exp123',
          expenseType: 'Mileage',
          amount: 30.75,
        };
        apiStub.resolves(mockUpdatedExpense);

        const expenseData = {
          amount: 30.75,
          tripType: 'RoundTrip',
        };

        await updateExpense('claim123', 'mileage', 'exp123', expenseData)(
          mockDispatch,
        );

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_SUCCESS',
            claimId: 'claim123',
            payload: mockUpdatedExpense,
          }),
        ).to.be.true;
      });

      it('should call correct actions for update expense failure', async () => {
        const mockDispatch = sinon.spy();
        apiStub.rejects(new Error('Failed to update expense'));

        const expenseData = { amount: 25.0 };

        await updateExpense('claim123', 'mileage', 'exp123', expenseData)(
          mockDispatch,
        );

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_FAILURE',
            error: sinon.match.instanceOf(Error),
          }),
        ).to.be.true;
      });
    });

    describe('Delete Expense', () => {
      it('should call correct actions for delete expense success', async () => {
        const mockDispatch = sinon.spy();
        apiStub.resolves(); // DELETE requests typically return empty response

        await deleteExpense('claim123', 'mileage', 'exp123')(mockDispatch);

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_SUCCESS',
            claimId: 'claim123',
            expenseId: 'exp123',
          }),
        ).to.be.true;
      });

      it('should call correct actions for delete expense failure', async () => {
        const mockDispatch = sinon.spy();
        apiStub.rejects(new Error('Failed to delete expense'));

        await deleteExpense('claim123', 'mileage', 'exp123')(mockDispatch);

        expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
          .to.be.true;
        expect(
          mockDispatch.calledWithMatch({
            type: 'UPDATE_EXPENSE_FAILURE',
            error: sinon.match.instanceOf(Error),
          }),
        ).to.be.true;
      });
    });
  });
});
