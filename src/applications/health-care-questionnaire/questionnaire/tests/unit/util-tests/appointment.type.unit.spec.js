import { expect } from 'chai';

import { getAppointTypeFromAppointment } from '../../../utils';

describe('health care questionnaire -- utils -- appointment parser -- getAppointTypeFromAppointment', () => {
  it('appointment is undefined', () => {
    const result = getAppointTypeFromAppointment(undefined);
    expect(result).to.be.null;
  });
  it('appointment.attributes is undefined', () => {
    const result = getAppointTypeFromAppointment({});
    expect(result).to.be.null;
  });
  it('appointment structure is missing vdsAppointments', () => {
    const result = getAppointTypeFromAppointment({ attributes: {} });
    expect(result).to.be.null;
  });
  it('vdsAppointments is an empty array', () => {
    const result = getAppointTypeFromAppointment({
      attributes: { vdsAppointments: [] },
    });
    expect(result).to.be.null;
  });
  it('vdsAppointments exists, but clinic is empty', () => {
    const result = getAppointTypeFromAppointment({
      attributes: { vdsAppointments: [{ clinic: null }] },
    });
    expect(result).to.be.null;
  });
  it("clinic exists, but stop code doesn't", () => {
    const result = getAppointTypeFromAppointment({
      attributes: { vdsAppointments: [{ clinic: { stopCode: null } }] },
    });
    expect(result).to.be.null;
  });
  it('stop exists, but does not match the codes we care about ', () => {
    const result = getAppointTypeFromAppointment({
      attributes: {
        vdsAppointments: [{ clinic: { stopCode: 'Do not care' } }],
      },
    });
    expect(result).to.be.null;
  });
  it('stop exists, primary care ', () => {
    const result = getAppointTypeFromAppointment({
      attributes: {
        vdsAppointments: [{ clinic: { stopCode: '323' } }],
      },
    });
    expect(result).to.equal('primary care');
  });
  it('stop exists, mental health  ', () => {
    const result = getAppointTypeFromAppointment({
      attributes: {
        vdsAppointments: [{ clinic: { stopCode: '502' } }],
      },
    });
    expect(result).to.equal('mental health');
  });
});
