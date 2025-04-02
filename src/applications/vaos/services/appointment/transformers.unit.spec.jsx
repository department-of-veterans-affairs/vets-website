import { expect } from 'chai';
import { getAppointmentType } from './transformers';

describe('getAppointmentType util', () => {
  it('should return appointment type as request', async () => {
    const appointment = {
      id: 'CERN123',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('request');
  });
  it('should return appointment type as vaAppointment for cerner appointment', async () => {
    const appointment = {
      id: 'CERN123',
      end: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('vaAppointment');
  });
  it('should return appointment type as ccAppointment, useFeSourceOfTruthCC=false', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('ccAppointment');
  });
  it('should return appointment type as ccAppointment, useFeSourceOfTruthCC=true', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_APPOINTMENT',
    };
    const result = getAppointmentType(appointment, true, false);
    expect(result).to.equal('ccAppointment');
  });
  it('should return appointment type as ccRequest, useFeSourceOfTruthCC=false', async () => {
    const appointment = {
      id: '123',
      kind: 'cc',
      requestedPeriods: [
        {
          start: '2021-08-31T17:00:00Z',
        },
      ],
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('ccRequest');
  });
  it('should return appointment type as ccRequest, useFeSourceOfTruthCC=true', async () => {
    const appointment = {
      id: '123',
      type: 'COMMUNITY_CARE_REQUEST',
    };
    const result = getAppointmentType(appointment, true, false);
    expect(result).to.equal('ccRequest');
  });
  it('should return appointment type as vaAppointment, useFeSourceOfTruthVA=false', async () => {
    const appointment = {
      id: '123',
      kind: 'clinic',
      start: '2021-08-31T17:00:00Z',
    };
    const result = getAppointmentType(appointment, false, false);
    expect(result).to.equal('vaAppointment');
  });
  it('should return appointment type as vaAppointment, useFeSourceOfTruthVA=true', async () => {
    const appointment = {
      id: '123',
      type: 'VA',
    };
    const result = getAppointmentType(appointment, false, true);
    expect(result).to.equal('vaAppointment');
  });
});
