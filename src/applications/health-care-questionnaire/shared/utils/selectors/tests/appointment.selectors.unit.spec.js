import { expect } from 'chai';

import { appointment } from '../index';

describe('health care questionnaire -- utils -- get appointment status --', () => {
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
