import { expect } from 'chai';

import { getFacilityFromAppointment } from '../../../utils';

describe('health care questionnaire -- utils -- appointment parser -- get facility from appointment', () => {
  it('appointment is undefined', () => {
    const result = getFacilityFromAppointment(undefined);
    expect(result).to.be.null;
  });
  it('appointment.attributes is undefined', () => {
    const result = getFacilityFromAppointment({});
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getFacilityFromAppointment({ attributes: {} });
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getFacilityFromAppointment({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, but clinic is empty', () => {
    const result = getFacilityFromAppointment({
      attributes: { vdsAppointments: [{ clinic: null }] },
    });
    expect(result).to.be.null;
  });
  it('facility exists', () => {
    const result = getFacilityFromAppointment({
      attributes: {
        vdsAppointments: [
          { clinic: { facility: { displayName: 'abc', phoneNumber: '123' } } },
        ],
      },
    });
    expect(result).to.be.an('object');
    expect(result).to.have.property('displayName');
    expect(result).to.have.property('phoneNumber');
  });
});
