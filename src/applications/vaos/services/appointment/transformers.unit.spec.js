import { expect } from 'chai';
import { getAppointmentType } from './transformers';

describe('getAppointmentType util', () => {
  it('should return appointment type as request', async () => {
    const appointment = {
      id: 'CERN123',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('request');
  });
  it('should return appointment type as vaAppointment for cerner appointment', async () => {
    const appointment = {
      id: 'CERN123',
      end: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('vaAppointment');
  });
  it('should return appointment type as ccAppointment', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('ccAppointment');
  });
  it('should return appointment type as ccRequest', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      requestedPeriods: [
        {
          start: '2021-08-31T17:00:00Z',
        },
      ],
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('ccRequest');
  });
  it('should return appointment type as vaAppointment', async () => {
    const appointment = {
      id: '123',
      kind: 'clinic',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment);
    expect(result).to.equal('vaAppointment');
  });
});
