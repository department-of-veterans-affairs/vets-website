import { expect } from 'chai';

import { getClinicFromAppointment } from '../../../utils';

describe('health care questionnaire -- utils -- appointment parser -- get clinic from appointment', () => {
  it('appointment is undefined', () => {
    const result = getClinicFromAppointment(undefined);
    expect(result).to.be.null;
  });
  it('appointment.attributes is undefined', () => {
    const result = getClinicFromAppointment({});
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getClinicFromAppointment({ attributes: {} });
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getClinicFromAppointment({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, but clinic is empty', () => {
    const result = getClinicFromAppointment({
      attributes: { vdsAppointments: [{ clinic: null }] },
    });
    expect(result).to.be.null;
  });
  it('clinic exists', () => {
    const result = getClinicFromAppointment({
      attributes: { vdsAppointments: [{ clinic: { phoneNumber: null } }] },
    });
    expect(result).to.be.an('object');
    expect(result).to.have.property('friendlyName');
    expect(result).to.have.property('phoneNumber');
  });
});
