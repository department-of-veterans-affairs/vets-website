import { expect } from 'chai';

import { appointmentSelector as appointment } from '../index';

describe('health care questionnaire -- utils -- get appointment status --', () => {
  describe('getStartDateTime', () => {
    it('appointment is undefined', () => {
      const result = appointment.getStartDateTime(undefined);
      expect(result).to.be.null;
    });
    it("appointment exists, but appointment start time doesn't ", () => {
      const result = appointment.getStartDateTime({
        start: undefined,
      });
      expect(result).to.be.undefined;
    });
    it('appointment status exists', () => {
      const result = appointment.getStartDateTime({
        start: 'Sample Time',
      });
      expect(result).to.be.equal('Sample Time');
    });
  });
  describe('getStartDateTime', () => {
    it('appointment is undefined', () => {
      const result = appointment.getStartTimeInTimeZone(undefined);
      expect(result).to.be.null;
    });
    it("appointment exists, but appointment start time doesn't ", () => {
      const result = appointment.getStartTimeInTimeZone({
        start: undefined,
      });
      expect(result).to.be.null;
    });
    it('appointment has a start date', () => {
      const result = appointment.getStartTimeInTimeZone({
        start: '2021-07-31T08:00:00Z',
      });
      expect(result).to.equal('1:00 a.m. PDT');
    });
    describe('options', () => {
      it('default time zone', () => {
        const result = appointment.getStartTimeInTimeZone({
          start: '2021-07-31T08:00:00Z',
        });
        expect(result).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (P[D|S]T)/);
      });
      it('custom time zone', () => {
        const result = appointment.getStartTimeInTimeZone(
          {
            start: '2021-07-31T08:00:00Z',
          },
          {
            timeZone: 'America/New_York',
            showTimeZone: true,
            showMeridiem: true,
            momentFormat: `h:mm`,
          },
        );
        expect(result).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (E[D|S]T)/);
      });
      it('default show time zone', () => {
        const result = appointment.getStartTimeInTimeZone({
          start: '2021-07-31T08:00:00Z',
        });
        expect(result).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (P[D|S]T)/);
      });
      it('no show time zone', () => {
        const result = appointment.getStartTimeInTimeZone(
          {
            start: '2021-07-31T08:00:00Z',
          },
          {
            timeZone: 'America/New_York',
            showTimeZone: false,
            showMeridiem: true,
            momentFormat: `h:mm`,
          },
        );
        expect(result).to.not.match(
          /([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (E[D|S]T)/,
        );
        expect(result).to.equal('4:00 a.m.');
      });
      it('default meridiem', () => {
        const result = appointment.getStartTimeInTimeZone({
          start: '2021-07-31T08:00:00Z',
        });
        expect(result).to.contain('a.m.');
      });
      it('no meridiem', () => {
        const result = appointment.getStartTimeInTimeZone(
          {
            start: '2021-07-31T08:00:00Z',
          },
          {
            timeZone: 'America/New_York',
            showTimeZone: true,
            showMeridiem: false,
            momentFormat: `h:mm`,
          },
        );
        expect(result).to.not.match(
          /([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (E[D|S]T)/,
        );
        expect(result).to.equal('4:00  EDT');
      });
      it('default time format', () => {
        const result = appointment.getStartTimeInTimeZone({
          start: '2021-07-31T08:00:00Z',
        });
        expect(result).to.match(/([\d]|[\d][\d]):[\d][\d]\s[a|p].m. (P[D|S]T)/);
      });
      it('custom time format', () => {
        const result = appointment.getStartTimeInTimeZone(
          {
            start: '2021-07-31T08:00:00Z',
          },
          {
            timeZone: 'America/New_York',
            showTimeZone: true,
            showMeridiem: true,
            momentFormat: `h---mm`,
          },
        );
        expect(result).to.match(
          /([\d]|[\d][\d])---[\d][\d]\s[a|p].m. (E[D|S]T)/,
        );
      });
    });
  });
});
