import { expect } from 'chai';

import { getAppointmentStatus } from '../../../utils';

describe('health care questionnaire -- utils -- questionnaire list -- get appointment status --', () => {
  it('appointment is undefined', () => {
    const result = getAppointmentStatus(undefined);
    expect(result).to.be.null;
  });
  it('appointment.attributes is undefined', () => {
    const result = getAppointmentStatus({});
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getAppointmentStatus({ attributes: {} });
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getAppointmentStatus({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.undefined;
  });
  it('vdsAppointments exists, and appointment status is null ', () => {
    const result = getAppointmentStatus({
      attributes: { vdsAppointments: [{ currentStatus: null }] },
    });
    expect(result).to.be.null;
  });
  it('appointment status exists', () => {
    const result = getAppointmentStatus({
      attributes: {
        vdsAppointments: [{ currentStatus: 'the current status' }],
      },
    });
    expect(result).to.be.equal('the current status');
  });
});
