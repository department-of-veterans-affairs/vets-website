import { expect } from 'chai';
import {
  receivedMultipleAppointmentDetails,
  RECEIVED_APPOINTMENT_DETAILS,
  receivedDemographicsData,
  RECEIVED_DEMOGRAPHICS_DATA,
  triggerRefresh,
  TRIGGER_REFRESH,
  SEE_STAFF_MESSAGE_UPDATED,
  seeStaffMessageUpdated,
  additionalContext,
  ADDITIONAL_CONTEXT,
} from './index';

describe('check in actions', () => {
  describe('actions', () => {
    describe('receivedMultipleAppointmentDetails', () => {
      it('should return correct action', () => {
        const action = receivedMultipleAppointmentDetails([]);
        expect(action.type).to.equal(RECEIVED_APPOINTMENT_DETAILS);
      });
      it('should return correct structure', () => {
        const action = receivedMultipleAppointmentDetails([{ id: 'some-id' }]);
        expect(action.payload.appointments[0]).to.haveOwnProperty('id');
        expect(action.payload.appointments[0].id).to.equal('some-id');
      });
    });

    describe('receivedDemographicsData', () => {
      it('should return correct action', () => {
        const action = receivedDemographicsData({});
        expect(action.type).to.equal(RECEIVED_DEMOGRAPHICS_DATA);
      });
      it('should return correct structure', () => {
        const action = receivedDemographicsData({
          homePhone: '555-867-5309',
        });
        expect(action.payload).to.haveOwnProperty('demographics');
        expect(action.payload.demographics.homePhone).to.equal('555-867-5309');
      });
    });
    describe('triggerRefresh', () => {
      it('should return correct action', () => {
        const action = triggerRefresh();
        expect(action.type).to.equal(TRIGGER_REFRESH);
      });
      it('should return correct structure', () => {
        const action = triggerRefresh();
        expect(action.payload.context.shouldRefresh).to.equal(true);
      });
    });
    describe('seeStaffMessageUpdated', () => {
      it('should return correct action', () => {
        const action = seeStaffMessageUpdated('test');
        expect(action.type).to.equal(SEE_STAFF_MESSAGE_UPDATED);
      });
      it('should return correct structure', () => {
        const action = seeStaffMessageUpdated('test');
        expect(action.payload.seeStaffMessage).to.equal('test');
      });
    });
    describe('additionalContext', () => {
      it('should return correct action', () => {
        const action = additionalContext();
        expect(action.type).to.equal(ADDITIONAL_CONTEXT);
      });
      it('should return correct structure', () => {
        const action = additionalContext({ newContext: true });
        expect(action.payload.context.newContext).to.equal(true);
      });
    });
  });
});
