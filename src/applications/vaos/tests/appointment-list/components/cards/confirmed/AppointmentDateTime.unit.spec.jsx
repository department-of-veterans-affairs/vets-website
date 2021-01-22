import { expect } from 'chai';
import {
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
} from '../../../../../appointment-list/components/cards/confirmed/AppointmentDateTime';

describe('getAppointmentTimezoneAbbreviation', () => {
  it('should return the timezone for a community care appointment', () => {
    expect(getAppointmentTimezoneAbbreviation('-04:00 EDT')).to.equal('ET');
  });

  it('should return the timezone for a community care appointment request', () => {
    expect(getAppointmentTimezoneAbbreviation(null, '578')).to.equal('CT');
  });
});

describe('getAppointmentTimezoneDescription', () => {
  it('should return the timezone', () => {
    expect(getAppointmentTimezoneDescription('-04:00 EDT')).to.equal(
      'Eastern time',
    );
  });
});
