import { expect } from 'chai';

import { getAppointmentTypeFromClinic } from '../../../utils';

describe('health care questionnaire -- utils -- clinic parser -- getAppointmentTypeFromClinic', () => {
  it('clinic is undefined', () => {
    const result = getAppointmentTypeFromClinic(undefined);
    expect(result).to.be.null;
  });
  it('clinic.stopCode is undefined', () => {
    const result = getAppointmentTypeFromClinic({});
    expect(result).to.be.null;
  });
  it("clinic exists, but stop code doesn't", () => {
    const result = getAppointmentTypeFromClinic({
      stopCode: null,
    });
    expect(result).to.be.null;
  });
  it('clinic exists, but stop code can be a number', () => {
    const result = getAppointmentTypeFromClinic({
      stopCode: 323,
    });
    expect(result).to.equal('primary care');
  });
  it('stop exists, but does not match the codes we care about ', () => {
    const result = getAppointmentTypeFromClinic({
      stopCode: 'Do not care',
    });
    expect(result).to.be.null;
  });
  it('stop exists, primary care ', () => {
    const result = getAppointmentTypeFromClinic({
      stopCode: '323',
    });
    expect(result).to.equal('primary care');
  });
  it('stop exists, mental health  ', () => {
    const result = getAppointmentTypeFromClinic({
      stopCode: '502',
    });
    expect(result).to.equal('mental health');
  });
  it('stop exists, to title case  ', () => {
    const result = getAppointmentTypeFromClinic(
      {
        stopCode: '502',
      },
      { titleCase: true },
    );
    expect(result).to.equal('Mental health');
  });
});
