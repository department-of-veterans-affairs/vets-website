import { expect } from 'chai';
import sinon from 'sinon';

import * as api from '@department-of-veterans-affairs/platform-utilities/api';
import {
  getTravelClaims,
  getClaimDetails,
  getAppointmentData,
  getAppointmentDataByDateTime,
  submitMileageOnlyClaim,
  createComplexClaim,
  submitComplexClaim,
  createExpense,
  updateExpense,
  deleteExpense,
  deleteDocument,
  deleteExpenseDeleteDocument,
  setExpenseBackDestination,
  SET_EXPENSE_BACK_DESTINATION,
} from '../../redux/actions';
import { EXPENSE_TYPES } from '../../constants';
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

  describe('Appointments by date/time', () => {
    it('should find matching appointment when localStartTime matches target', async () => {
      const mockDispatch = sinon.spy();
      const targetDateTime = '2024-12-30T08:00:00.000-06:00';

      // Mock API returns multiple appointments, one matching
      apiStub.resolves({
        data: [
          {
            attributes: {
              start: '2024-12-30T08:00:00Z',
              localStartTime: '2024-12-30T02:00:00.000-06:00',
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'Non-matching appointment' },
              },
            },
          },
          {
            attributes: {
              start: '2024-12-30T14:00:00Z',
              localStartTime: targetDateTime, // This matches
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'Cheyenne VA Medical Center' },
              },
            },
          },
          {
            attributes: {
              start: '2024-12-30T20:00:00Z',
              localStartTime: '2024-12-30T14:00:00.000-06:00',
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'Another non-matching appointment' },
              },
            },
          },
        ],
      });

      await getAppointmentDataByDateTime(targetDateTime)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_STARTED',
        }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_SUCCESS',
        }),
      ).to.be.true;

      // Verify the correct appointment was matched
      const successCall = mockDispatch
        .getCalls()
        .find(
          call => call.args[0].type === 'FETCH_APPOINTMENT_BY_DATE_SUCCESS',
        );
      expect(successCall.args[0].payload.location.attributes.name).to.equal(
        'Cheyenne VA Medical Center',
      );
    });

    it('should handle matching with different timezone offsets using stripTZOffset', async () => {
      const mockDispatch = sinon.spy();
      const targetDateTime = '2024-12-30T08:00:00.000-08:00'; // PST

      apiStub.resolves({
        data: [
          {
            attributes: {
              start: '2024-12-30T16:00:00Z',
              localStartTime: '2024-12-30T08:00:00.000-08:00', // Same time, PST
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'San Diego VA' },
              },
            },
          },
        ],
      });

      await getAppointmentDataByDateTime(targetDateTime)(mockDispatch);

      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_SUCCESS',
        }),
      ).to.be.true;

      // Verify the correct appointment was matched
      const successCall = mockDispatch
        .getCalls()
        .find(
          call => call.args[0].type === 'FETCH_APPOINTMENT_BY_DATE_SUCCESS',
        );
      expect(successCall.args[0].payload.location.attributes.name).to.equal(
        'San Diego VA',
      );
    });

    it('should fail when no appointments found in date range', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves({ data: [] });

      await getAppointmentDataByDateTime('2024-12-30T08:00:00.000-06:00')(
        mockDispatch,
      );

      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_STARTED',
        }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_FAILURE',
          error: sinon.match('No appointments found in date range'),
        }),
      ).to.be.true;
    });

    it('should fail when no matching localStartTime found', async () => {
      const mockDispatch = sinon.spy();

      apiStub.resolves({
        data: [
          {
            attributes: {
              start: '2024-12-30T14:00:00Z',
              localStartTime: '2024-12-30T10:00:00.000-06:00', // Doesn't match target
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'Cheyenne VA Medical Center' },
              },
            },
          },
        ],
      });

      await getAppointmentDataByDateTime('2024-12-30T08:00:00.000-06:00')(
        mockDispatch,
      );

      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_STARTED',
        }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_FAILURE',
          error: sinon.match(
            'No appointment found with matching localStartTime',
          ),
        }),
      ).to.be.true;
    });

    it('should fail when API request fails', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Network error'));

      await getAppointmentDataByDateTime('2024-12-30T08:00:00.000-06:00')(
        mockDispatch,
      );

      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_STARTED',
        }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_APPOINTMENT_BY_DATE_FAILURE',
        }),
      ).to.be.true;
    });

    it('should create correct ±12 hour time window for API request', async () => {
      const mockDispatch = sinon.spy();
      const targetDateTime = '2024-12-30T12:00:00.000-06:00';

      apiStub.resolves({
        data: [
          {
            attributes: {
              start: '2024-12-30T18:00:00Z',
              localStartTime: targetDateTime,
              location: {
                id: '983',
                type: 'appointments',
                attributes: { name: 'Test VA' },
              },
            },
          },
        ],
      });

      await getAppointmentDataByDateTime(targetDateTime)(mockDispatch);

      // Verify API was called with start/end times
      expect(apiStub.calledOnce).to.be.true;
      const apiUrl = apiStub.firstCall.args[0];

      // URL should contain start and end query parameters
      expect(apiUrl).to.include('start=');
      expect(apiUrl).to.include('end=');
      expect(apiUrl).to.include('_include=facilities,travel_pay_claims');
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

      try {
        await createComplexClaim(submissionData)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Failed to create claim');
      }

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

      expect(
        mockDispatch.calledWithMatch({ type: 'SUBMIT_COMPLEX_CLAIM_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'SUBMIT_COMPLEX_CLAIM_SUCCESS',
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

      try {
        await submitComplexClaim(claimData)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Failed to submit claim');
      }

      expect(
        mockDispatch.calledWithMatch({ type: 'SUBMIT_COMPLEX_CLAIM_STARTED' }),
      ).to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'SUBMIT_COMPLEX_CLAIM_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });
  });

  describe('Create Expense', () => {
    it('should call correct actions for create expense success', async () => {
      const mockDispatch = sinon.stub();
      // Make mockDispatch execute thunks when they're dispatched
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const mockExpenseResponse = { id: 'exp123' };
      const mockClaimDetails = {
        expenses: [{ id: 'exp123', documentId: 'doc123' }],
      };
      apiStub.onFirstCall().resolves(mockExpenseResponse); // POST expense
      apiStub.onSecondCall().resolves(mockClaimDetails); // GET claim details

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

      expect(mockDispatch.calledWithMatch({ type: 'CREATE_EXPENSE_STARTED' }))
        .to.be.true;
      // Should call getComplexClaimDetails to load full expense data
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_COMPLEX_CLAIM_DETAILS_STARTED',
        }),
      ).to.be.true;
    });

    it('should call correct actions for create expense failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to create expense'));

      const expenseData = { expenseType: 'Parking', amount: 10.0 };

      try {
        await createExpense('claim123', 'parking', expenseData)(mockDispatch);
      } catch (error) {
        // Expected to throw
      }

      expect(mockDispatch.calledWithMatch({ type: 'CREATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'CREATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is missing', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 10.0 };

      try {
        await createExpense('claim123', null, expenseData)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'CREATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'CREATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is undefined', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 10.0 };

      try {
        await createExpense('claim123', undefined, expenseData)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'CREATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'CREATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error if getComplexClaimDetails fails', async () => {
      const mockDispatch = sinon.stub();
      // Make mockDispatch execute thunks when they're dispatched
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      apiStub.onFirstCall().resolves({ id: 'exp123' }); // expense POST
      apiStub
        .onSecondCall()
        .rejects(new Error('Failed to fetch claim details')); // fetch

      const expenseData = { expenseType: 'Parking', amount: 10.0 };

      try {
        await createExpense('claim123', 'Parking', expenseData)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Failed to fetch claim details');
      }

      expect(mockDispatch.calledWithMatch({ type: 'CREATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_COMPLEX_CLAIM_DETAILS_STARTED',
        }),
      ).to.be.true;
    });
  });

  describe('Update Expense', () => {
    it('should call correct actions for update expense success', async () => {
      const mockDispatch = sinon.stub();
      // Make mockDispatch execute thunks when they're dispatched
      mockDispatch.callsFake(action => {
        if (typeof action === 'function') {
          return action(mockDispatch);
        }
        return action;
      });

      const mockExpenseResponse = { id: 'exp123' };
      const mockClaimDetails = {
        expenses: [
          {
            id: 'exp123',
            amount: 30.75,
            tripType: 'RoundTrip',
            documentId: 'doc123',
          },
        ],
      };
      apiStub.onFirstCall().resolves(mockExpenseResponse); // PATCH expense
      apiStub.onSecondCall().resolves(mockClaimDetails); // GET claim details

      const expenseData = {
        amount: 30.75,
        tripType: 'RoundTrip',
      };

      await updateExpense('claim123', 'mileage', 'exp123', expenseData)(
        mockDispatch,
      );

      expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
        .to.be.true;
      // Should call getComplexClaimDetails to load full expense data
      expect(
        mockDispatch.calledWithMatch({
          type: 'FETCH_COMPLEX_CLAIM_DETAILS_STARTED',
        }),
      ).to.be.true;
    });

    it('should call correct actions for update expense failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to update expense'));

      const expenseData = { amount: 25.0 };

      try {
        await updateExpense('claim123', 'mileage', 'exp123', expenseData)(
          mockDispatch,
        );
      } catch (error) {
        // Expected to throw
      }

      expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'UPDATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is missing', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 25.0 };

      try {
        await updateExpense('claim123', null, 'exp123', expenseData)(
          mockDispatch,
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'UPDATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense id is missing', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 25.0 };

      try {
        await updateExpense('claim123', 'mileage', null, expenseData)(
          mockDispatch,
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense id');
      }

      expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'UPDATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is undefined', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 25.0 };

      try {
        await updateExpense('claim123', undefined, 'exp123', expenseData)(
          mockDispatch,
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'UPDATE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'UPDATE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense id is undefined', async () => {
      const mockDispatch = sinon.spy();
      const expenseData = { amount: 25.0 };

      try {
        await updateExpense('claim123', 'mileage', undefined, expenseData)(
          mockDispatch,
        );
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense id');
      }

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

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_SUCCESS',
          expenseId: 'exp123',
        }),
      ).to.be.true;
    });

    it('should call correct actions for delete expense failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to delete expense'));

      try {
        await deleteExpense('claim123', 'mileage', 'exp123')(mockDispatch);
      } catch (error) {
        // Expected to throw
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is missing', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteExpense('claim123', null, 'exp123')(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense id is missing', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteExpense('claim123', 'mileage', null)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense id');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense type is undefined', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteExpense('claim123', undefined, 'exp123')(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when expense id is undefined', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteExpense('claim123', 'mileage', undefined)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense id');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_EXPENSE_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });
  });

  describe('Delete Document', () => {
    const claimId = 'a48d48d4-cdc5-4922-8355-c1a9b2742feb';
    const documentId = '4f6f751b-87ff-ef11-9341-001dd809b68c';
    it('should call correct actions for delete document success', async () => {
      const mockDispatch = sinon.spy();
      apiStub.resolves(); // DELETE requests typically return empty response

      await deleteDocument(claimId, documentId)(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_DOCUMENT_SUCCESS',
          documentId,
        }),
      ).to.be.true;
    });

    it('should call correct actions for delete document failure', async () => {
      const mockDispatch = sinon.spy();
      apiStub.rejects(new Error('Failed to delete document'));

      try {
        await deleteDocument(claimId, documentId)(mockDispatch);
      } catch (error) {
        // Expected to throw
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_DOCUMENT_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when document id is missing', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteDocument(claimId)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing document id');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_DOCUMENT_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });

    it('should throw error when document id is undefined', async () => {
      const mockDispatch = sinon.spy();

      try {
        await deleteDocument(claimId, undefined)(mockDispatch);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing document id');
      }

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.true;
      expect(
        mockDispatch.calledWithMatch({
          type: 'DELETE_DOCUMENT_FAILURE',
          error: sinon.match.instanceOf(Error),
        }),
      ).to.be.true;
    });
  });

  describe('deleteExpenseDeleteDocument', () => {
    let mockDispatch;
    beforeEach(() => {
      mockDispatch = sinon.spy();
    });

    const claimId = 'claim123';
    const expenseId = 'exp123';
    const documentId = 'doc123';

    it('should delete both expense and document for non-mileage expense', async () => {
      const expenseType = EXPENSE_TYPES.Parking.route;

      apiStub.resolves(); // resolve for DELETE requests

      await deleteExpenseDeleteDocument(
        claimId,
        documentId,
        expenseType,
        expenseId,
      )(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_SUCCESS' }))
        .to.be.true;
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.true;
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_SUCCESS' }))
        .to.be.true;
    });

    it('should skip document deletion for MILEAGE expense', async () => {
      const expenseType = EXPENSE_TYPES.Mileage.route;

      apiStub.resolves(); // resolve for DELETE requests

      await deleteExpenseDeleteDocument(
        claimId,
        documentId,
        expenseType,
        expenseId,
      )(mockDispatch);

      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_STARTED' }))
        .to.be.true;
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_EXPENSE_SUCCESS' }))
        .to.be.true;
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_STARTED' }))
        .to.be.false; // document deletion should be skipped
      expect(mockDispatch.calledWithMatch({ type: 'DELETE_DOCUMENT_SUCCESS' }))
        .to.be.false;
    });

    it('should throw error if expenseType is missing', async () => {
      try {
        await deleteExpenseDeleteDocument(claimId, documentId, null, expenseId)(
          mockDispatch,
        );
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense type');
      }
    });

    it('should throw error if expenseId is missing', async () => {
      try {
        await deleteExpenseDeleteDocument(
          claimId,
          documentId,
          EXPENSE_TYPES.Parking.route,
          null,
        )(mockDispatch);
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Missing expense id');
      }
    });
  });

  describe('setExpenseBackDestination', () => {
    it('should create action with correct type and payload', () => {
      const destination = 'some-destination';
      const action = setExpenseBackDestination(destination);

      expect(action).to.deep.equal({
        type: SET_EXPENSE_BACK_DESTINATION,
        payload: destination,
      });
    });
  });
});
