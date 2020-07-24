import { expect } from 'chai';
import moment from 'moment';
import {
  generateICS,
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
  getRealFacilityId,
  getPastAppointmentDateRangeOptions,
} from '../../utils/appointment';
import {
  APPOINTMENT_TYPES,
  VIDEO_TYPES,
  APPOINTMENT_STATUS,
  CANCELLED_APPOINTMENT_SET,
  PAST_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDE_STATUS_SET,
  FUTURE_APPOINTMENTS_HIDDEN_SET,
  PAST_APPOINTMENTS_HIDDEN_SET,
} from '../../utils/constants';
import confirmedCC from '../../api/confirmed_cc.json';
import confirmedVA from '../../api/confirmed_va.json';
import requestData from '../../api/requests.json';
import { getVARequestMock } from '../mocks/v0';
import { setRequestedPeriod } from '../mocks/helpers';

describe('VAOS appointment helpers', () => {
  const now = moment();
  const communityCareAppointmentRequest = {
    typeOfCareId: 'CC',
    timeZone: '-06:00 MDT',
  };
  const vaAppointmentRequest = {
    optionDate1: ' ',
  };
  const vaAppointment = {
    clinicId: '123',
    vvsAppointments: [],
  };
  const communityCareAppointment = {
    appointmentTime: ' ',
    timeZone: '-04:00 EDT',
  };

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

  describe('getPastAppointmentDateRangeOptions', () => {
    const ranges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));
    it('should return 6 correct date ranges for dropdown', () => {
      expect(ranges.length).to.equal(6);

      expect(ranges[0].value).to.equal(0);
      expect(ranges[0].label).to.equal('Past 3 months');
      expect(ranges[0].startDate).to.include('2019-11-02T00:00:00');
      expect(ranges[0].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[1].value).to.equal(1);
      expect(ranges[1].label).to.equal('Sept. 2019 – Nov. 2019');
      expect(ranges[1].startDate).to.include('2019-09-01T00:00:00');
      expect(ranges[1].endDate).to.include('2019-11-30T23:59:59');

      expect(ranges[2].value).to.equal(2);
      expect(ranges[2].label).to.equal('June 2019 – Aug. 2019');
      expect(ranges[2].startDate).to.include('2019-06-01T00:00:00');
      expect(ranges[2].endDate).to.include('2019-08-31T23:59:59');

      expect(ranges[3].value).to.equal(3);
      expect(ranges[3].label).to.equal('March 2019 – May 2019');
      expect(ranges[3].startDate).to.include('2019-03-01T00:00:00');
      expect(ranges[3].endDate).to.include('2019-05-31T23:59:59');

      expect(ranges[4].value).to.equal(4);
      expect(ranges[4].label).to.equal('All of 2020');
      expect(ranges[4].startDate).to.include('2020-01-01T00:00:00');
      expect(ranges[4].endDate).to.include('2020-02-02T00:00:00');

      expect(ranges[5].value).to.equal(5);
      expect(ranges[5].label).to.equal('All of 2019');
      expect(ranges[5].startDate).to.include('2019-01-01T00:00:00');
      expect(ranges[5].endDate).to.include('2019-12-31T23:59:59');
    });
  });

  xdescribe('sortMessages', () => {});

  describe('getRealFacilityId', () => {
    it('should return the real facility id for not production environemnts', () => {
      expect(getRealFacilityId('983')).to.equal('442');
      expect(getRealFacilityId('984')).to.equal('552');
    });
  });

  describe('generateICS', () => {
    it('should generate valid ICS calendar commands', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');

      const ics = generateICS(
        'Community Care',
        '. ',
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain('DESCRIPTION:. ');
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
    it('should properly chunk long descriptions', () => {
      const momentDate = moment(now);
      const dtStamp = momentDate.format('YYYYMMDDTHHmmss');
      const dtStart = momentDate.format('YYYYMMDDTHHmmss');
      const dtEnd = momentDate
        .clone()
        .add(60, 'minutes')
        .format('YYYYMMDDTHHmmss');
      const description = `Testing long line descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions Testing long descriptions Testing long descriptions
Testing long descriptions`;

      const ics = generateICS(
        'Community Care',
        description,
        'Address 1 City, State Zip',
        dtStart,
        dtEnd,
      );
      expect(ics).to.contain('BEGIN:VCALENDAR');
      expect(ics).to.contain('VERSION:2.0');
      expect(ics).to.contain('PRODID:VA');
      expect(ics).to.contain('BEGIN:VEVENT');
      expect(ics).to.contain('UID:');
      expect(ics).to.contain('SUMMARY:Community Care');
      expect(ics).to.contain(
        'DESCRIPTION:Testing long line descriptions\\nTesting long descriptions Test\r\n\ting long descriptions Testing long descriptions\\nTesting long descriptions\r\n\t Testing long descriptions Testing long descriptions\\nTesting long descrip\r\n\ttions',
      );
      expect(ics).to.contain('LOCATION:Address 1 City, State Zip');
      expect(ics).to.contain(`DTSTAMP:${dtStamp}`);
      expect(ics).to.contain(`DTSTART:${dtStart}`);
      expect(ics).to.contain(`DTEND:${dtEnd}`);
      expect(ics).to.contain('END:VEVENT');
      expect(ics).to.contain('END:VCALENDAR');
    });
  });
});
