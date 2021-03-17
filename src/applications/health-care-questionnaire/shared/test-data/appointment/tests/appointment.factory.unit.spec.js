import { expect } from 'chai';

import { AppointmentData } from '../factory';

describe('health care questionnaire -- utils -- test data -- data factory -- appointment --', () => {
  it('appointment is created with status', () => {
    const appointment = new AppointmentData().withStatus('testing');

    expect(appointment).to.have.property('status');
    expect(appointment.status).to.equal('testing');
  });
});
