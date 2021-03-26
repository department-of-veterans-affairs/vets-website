import { expect } from 'chai';

import { appointmentSelector as appointment } from '../index';

describe('health care questionnaire -- utils -- get appointment status --', () => {
  describe('getStatus', () => {
    it('appointment is undefined', () => {
      const result = appointment.getStatus(undefined);
      expect(result).to.be.null;
    });
    it('appointment exists, and appointment status is null ', () => {
      const result = appointment.getStatus({
        status: null,
      });
      expect(result).to.be.null;
    });
    it('appointment status exists', () => {
      const result = appointment.getStatus({
        status: 'the current status',
      });
      expect(result).to.be.equal('the current status');
    });
  });
  describe('getStatus', () => {
    it('appointment is undefined', () => {
      const result = appointment.getStartTime(undefined);
      expect(result).to.be.null;
    });
    it("appointment exists, but appointment start time doesn't ", () => {
      const result = appointment.getStartTime({
        start: undefined,
      });
      expect(result).to.be.undefined;
    });
    it('appointment status exists', () => {
      const result = appointment.getStartTime({
        start: 'Sample Time',
      });
      expect(result).to.be.equal('Sample Time');
    });
  });
  describe('getBookingNote', () => {
    it('appointment is undefined', () => {
      const result = appointment.getBookingNote(undefined);
      expect(result).to.be.null;
    });
    it('appointment is missing comment field', () => {
      const result = appointment.getBookingNote({});
      expect(result).to.be.null;
    });
    it('comment exists, but is empty', () => {
      const result = appointment.getBookingNote({
        comment: null,
      });
      expect(result).to.be.null;
    });
    it('comment does not have an appointment type', () => {
      const result = appointment.getBookingNote({
        comment: 'this is my appointment reason',
      });
      expect(result.found).to.be.true;
      expect(result.description).to.be.equal('this is my appointment reason');
    });
    it('booking note has an appointment type -- follow-up/routine', () => {
      const result = appointment.getBookingNote({
        comment: 'Follow-up/Routine:this is my appointment reason',
      });
      expect(result.found).to.be.true;
      expect(result.reasonForVisit).to.be.equal('Routine or follow-up visit');
      expect(result.description).to.be.equal('this is my appointment reason');
    });
    it('booking note has an appointment type -- new issue', () => {
      const result = appointment.getBookingNote({
        comment: 'New issue:this is my appointment reason',
      });
      expect(result.found).to.be.true;
      expect(result.reasonForVisit).to.be.equal('I have a new medical issue');
      expect(result.description).to.be.equal('this is my appointment reason');
    });
    it('booking note has an appointment type -- medication concern', () => {
      const result = appointment.getBookingNote({
        comment: 'Medication concern:this is my appointment reason',
      });
      expect(result.found).to.be.true;
      expect(result.reasonForVisit).to.be.equal(
        'I have a concern or question about my medication',
      );
      expect(result.description).to.be.equal('this is my appointment reason');
    });
    it('booking note has an appointment type -- My reason isn’t listed', () => {
      const result = appointment.getBookingNote({
        comment: 'My reason isn’t listed:this is my appointment reason',
      });
      expect(result.found).to.be.true;
      expect(result.reasonForVisit).to.be.equal('');
      expect(result.description).to.be.equal('this is my appointment reason');
    });
  });
});
