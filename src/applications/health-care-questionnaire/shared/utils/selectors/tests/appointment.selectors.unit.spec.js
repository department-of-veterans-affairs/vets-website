import { expect } from 'chai';

import { appointment } from '../index';

describe('health care questionnaire -- utils -- questionnaire list -- get appointment status --', () => {
  it('appointment is undefined', () => {
    const result = appointment.getStatus(undefined);
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, and appointment status is null ', () => {
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
