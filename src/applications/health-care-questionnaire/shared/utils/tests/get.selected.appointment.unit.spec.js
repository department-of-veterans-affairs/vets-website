import { expect } from 'chai';

import { getSelectedAppointmentData } from '../index';

describe('health care questionnaire -- utils -- get selected appointment', () => {
  it('window is undefined', () => {
    const id = getSelectedAppointmentData(undefined);
    expect(id).to.be.null;
  });
  it('is in storage', () => {
    const window = {
      sessionStorage: {
        getItem: () => JSON.stringify({ appointment: { id: '67890' } }),
      },
    };
    const data = getSelectedAppointmentData(window, '67890');
    expect(data.appointment.id).to.equal('67890');
  });

  it('id is not found', () => {
    const window = {
      location: {
        search: '',
      },
      sessionStorage: {
        getItem: () => JSON.stringify({}),
      },
    };
    const appointment = getSelectedAppointmentData(window, '12345');
    expect(appointment).to.be.null;
  });
});
