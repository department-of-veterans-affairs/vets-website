import { expect } from 'chai';

import { getBookingNoteFromAppointment } from '../../../utils';

describe('health care questionnaire -- utils -- appointment parser -- getBookingNoteFromAppointment', () => {
  it('appointment is undefined', () => {
    const result = getBookingNoteFromAppointment(undefined);
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getBookingNoteFromAppointment({});
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getBookingNoteFromAppointment({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, but booking note is empty', () => {
    const result = getBookingNoteFromAppointment({
      attributes: { vdsAppointments: [{ bookingNote: null }] },
    });
    expect(result).to.be.null;
  });
  it('booking note does not have an appointment type', () => {
    const result = getBookingNoteFromAppointment({
      attributes: {
        vdsAppointments: [{ bookingNotes: 'this is my appointment reason' }],
      },
    });
    expect(result.found).to.be.true;
    expect(result.description).to.be.equal('this is my appointment reason');
  });
  it('booking note has an appointment type -- follow-up/routine', () => {
    const result = getBookingNoteFromAppointment({
      attributes: {
        vdsAppointments: [
          { bookingNotes: 'Follow-up/Routine:this is my appointment reason' },
        ],
      },
    });
    expect(result.found).to.be.true;
    expect(result.reasonForVisit).to.be.equal('Routine or follow-up visit');
    expect(result.description).to.be.equal('this is my appointment reason');
  });
  it('booking note has an appointment type -- new issue', () => {
    const result = getBookingNoteFromAppointment({
      attributes: {
        vdsAppointments: [
          { bookingNotes: 'New issue:this is my appointment reason' },
        ],
      },
    });
    expect(result.found).to.be.true;
    expect(result.reasonForVisit).to.be.equal('I have a new medical issue');
    expect(result.description).to.be.equal('this is my appointment reason');
  });
  it('booking note has an appointment type -- medication concern', () => {
    const result = getBookingNoteFromAppointment({
      attributes: {
        vdsAppointments: [
          { bookingNotes: 'Medication concern:this is my appointment reason' },
        ],
      },
    });
    expect(result.found).to.be.true;
    expect(result.reasonForVisit).to.be.equal(
      'I have a concern or question about my medication',
    );
    expect(result.description).to.be.equal('this is my appointment reason');
  });
  it('booking note has an appointment type -- My reason isn’t listed', () => {
    const result = getBookingNoteFromAppointment({
      attributes: {
        vdsAppointments: [
          {
            bookingNotes:
              'My reason isn’t listed:this is my appointment reason',
          },
        ],
      },
    });
    expect(result.found).to.be.true;
    expect(result.reasonForVisit).to.be.equal('');
    expect(result.description).to.be.equal('this is my appointment reason');
  });
});
