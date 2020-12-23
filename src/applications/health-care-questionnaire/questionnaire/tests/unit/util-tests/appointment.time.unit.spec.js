import { expect } from 'chai';

import { getAppointmentTimeFromAppointment } from '../../../utils';

describe('health care questionnaire -- utils -- appointment parser -- getAppointmentTimeFromAppointment', () => {
  it('appointment is undefined', () => {
    const result = getAppointmentTimeFromAppointment(undefined);
    expect(result).to.be.null;
  });
  it('appointment.attributes is undefined', () => {
    const result = getAppointmentTimeFromAppointment({});
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getAppointmentTimeFromAppointment({ attributes: {} });
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getAppointmentTimeFromAppointment({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, and appointment time is null ', () => {
    const result = getAppointmentTimeFromAppointment({
      attributes: { vdsAppointments: [{ appointmentTime: null }] },
    });
    expect(result).to.be.null;
  });
  it('appointment time exists', () => {
    const result = getAppointmentTimeFromAppointment({
      attributes: { vdsAppointments: [{ appointmentTime: 'the right time' }] },
    });
    expect(result).to.be.equal('the right time');
  });
});
