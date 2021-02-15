import { expect } from 'chai';

import { isAppointmentCancelled } from '../../../utils';

describe('health care questionnaire -- utils -- questionnaire list -- is appointment cancelled --', () => {
  it('status is falsy', () => {
    const result = isAppointmentCancelled(null);
    expect(result).to.be.undefined;
  });
  it('status is not upper case', () => {
    const result = isAppointmentCancelled('CANCELLED');
    expect(result).to.be.true;
  });
  it('status is a canceled status', () => {
    const result = isAppointmentCancelled('its on');
    expect(result).to.be.false;
  });
  it('status is not a canceled status', () => {
    const result = isAppointmentCancelled('CANCELLED BY CLINIC');
    expect(result).to.be.true;
  });
});
