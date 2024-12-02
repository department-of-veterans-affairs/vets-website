import { assert, expect } from 'chai';
import {
  allArraysEmpty,
  allFieldsEmpty,
  fieldHasValue,
  parseProblemDateTime,
  parseVistaDateTime,
  parseVistaDate,
  stripDst,
  formatImmunizationDate,
  getShortTimezone,
  getFormattedAppointmentTime,
  getFormattedAppointmentDate,
  getFormattedGenerationDate,
} from '../../utils/index';

describe('avs', () => {
  describe('utils', () => {
    describe('formatImmunizationDate', () => {
      it('should format a valid date correctly', () => {
        const date = '06/24/2020';
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('June 24, 2020'); // Adjust based on the actual output of formatDateLong
      });

      it('should return "N/A" for an improperly formatted date', () => {
        const date = '00/00/1998';
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('N/A');
      });

      it('should return "N/A" for an invalid date', () => {
        const date = 'invalid-date';
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('N/A');
      });

      it('should return "N/A" for an empty date string', () => {
        const date = '';
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('N/A');
      });

      it('should return "N/A" for a null date', () => {
        const date = null;
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('N/A');
      });

      it('should return "N/A" for an undefined date', () => {
        const date = undefined;
        const formattedDate = formatImmunizationDate(date);
        expect(formattedDate).to.equal('N/A');
      });
    });
    describe('parseProblemDateTime', () => {
      it('should correctly parse dates for all months', () => {
        const months = [
          { name: 'Jan', number: 0 },
          { name: 'Feb', number: 1 },
          { name: 'Mar', number: 2 },
          { name: 'Apr', number: 3 },
          { name: 'May', number: 4 },
          { name: 'Jun', number: 5 },
          { name: 'Jul', number: 6 },
          { name: 'Aug', number: 7 },
          { name: 'Sep', number: 8 },
          { name: 'Oct', number: 9 },
          { name: 'Nov', number: 10 },
          { name: 'Dec', number: 11 },
        ];

        months.forEach(month => {
          const dateString = `XXX ${month.name} 11 00:00:00 PDT 2023`;
          const expectedDate = new Date(2023, month.number, 11);
          const parsedDate = parseProblemDateTime(dateString);

          expect(parsedDate.getFullYear()).to.equal(expectedDate.getFullYear());
          expect(parsedDate.getMonth()).to.equal(expectedDate.getMonth());
          expect(parsedDate.getDate()).to.equal(expectedDate.getDate());
        });
      });

      it('should correctly parse a specific date', () => {
        const dateString = 'Thu Apr 07 00:00:00 EST 2005';
        const expectedDate = new Date(2005, 3, 7); // April is month 3 (zero-based)
        const parsedDate = parseProblemDateTime(dateString);

        expect(parsedDate.getFullYear()).to.equal(expectedDate.getFullYear());
        expect(parsedDate.getMonth()).to.equal(expectedDate.getMonth());
        expect(parsedDate.getDate()).to.equal(expectedDate.getDate());
      });

      it('should handle invalid date strings gracefully', () => {
        const dateString = 'Invalid Date String';
        const parsedDate = parseProblemDateTime(dateString);

        expect(parsedDate.toString()).to.equal('Invalid Date');
      });
    });

    describe('parse vista datetime format', () => {
      it('correctly parses an ambiguous datetime', () => {
        const vistaDateTime = '11/12/2018@16:00';
        const expected = new Date('2018-11-12T16:00:00');
        const result = parseVistaDateTime(vistaDateTime);
        assert.deepEqual(result, expected);
      });
    });

    describe('parse vista date format', () => {
      it('correctly parses an ambiguous date', () => {
        const vistaDate = '11/12/2018';
        const expected = new Date('2018-11-12T00:00:00');
        const result = parseVistaDate(vistaDate);
        assert.deepEqual(result, expected);
      });
    });

    describe('strip middle timezone character', () => {
      it('correctly strips out chars in eastern time', () => {
        const timeZone = 'America/New_York';
        let shortTimeZone = 'EST';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('ET');

        shortTimeZone = 'EDT';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('ET');
      });
      it('correctly strips out chars in central time', () => {
        const timeZone = 'America/Chicago';
        let shortTimeZone = 'CST';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('CT');

        shortTimeZone = 'CDT';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('CT');
      });
      it('correctly strips out chars in mountain time', () => {
        const timeZone = 'America/Denver';
        let shortTimeZone = 'MST';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('MT');

        shortTimeZone = 'MDT';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('MT');
      });
      it('correctly strips out chars in pacific time', () => {
        const timeZone = 'America/Los_Angeles';
        let shortTimeZone = 'PST';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('PT');

        shortTimeZone = 'PDT';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('PT');
      });
      it('does not attempt to strip out chars in non-us timezones', () => {
        const timeZone = 'replacementFunctions';
        const shortTimeZone = 'PHT';
        expect(stripDst(timeZone, shortTimeZone)).to.equal('PHT');
      });
    });

    describe('get timezone from AVS', () => {
      const avs = {
        meta: {
          timeZone: '',
        },
      };

      it('correctly returns eastern time', () => {
        avs.meta.timeZone = 'America/New_York';
        expect(getShortTimezone(avs)).to.equal('ET');
      });
      it('correctly returns central time', () => {
        avs.meta.timeZone = 'America/Chicago';
        expect(getShortTimezone(avs)).to.equal('CT');
      });
      it('correctly returns mountain time', () => {
        avs.meta.timeZone = 'America/Denver';
        expect(getShortTimezone(avs)).to.equal('MT');
      });
      it('correctly returns pacific time', () => {
        avs.meta.timeZone = 'America/Los_Angeles';
        expect(getShortTimezone(avs)).to.equal('PT');
      });
    });

    describe('format appointment time', () => {
      it('correctly returns morning times', () => {
        expect(getFormattedAppointmentTime('10:45')).to.equal('10:45 a.m.');
      });
      it('correctly returns afternoon times', () => {
        expect(getFormattedAppointmentTime('15:45')).to.equal('3:45 p.m.');
      });
    });

    describe('format appointment date', () => {
      it('correctly returns the date', () => {
        const avs = {
          clinicsVisited: [
            {
              date: '09/09/2023',
              time: '10:00',
            },
          ],
        };
        expect(getFormattedAppointmentDate(avs)).to.equal('September 9, 2023');
      });
      it('returns an empty string when the datetime is not available', () => {
        const avs = { clinicsVisited: [{ foo: 'bar' }] };
        expect(getFormattedAppointmentDate(avs)).to.be.empty;
      });
    });

    describe('format AVS generation date', () => {
      it('correctly returns the date', () => {
        const avs = {
          meta: {
            generatedDate: '2023-07-12T22:45:11Z',
            timeZone: 'America/Chicago',
          },
        };
        expect(getFormattedGenerationDate(avs)).to.equal(
          'July 12, 2023 at 5:45 p.m. CT',
        );
      });
    });

    describe('field has value', () => {
      it('returns true when a string is present', () => {
        expect(fieldHasValue('foo')).to.be.true;
      });
      it('returns true for the string 0', () => {
        expect(fieldHasValue('0')).to.be.true;
      });
      it('returns false when given an empty string', () => {
        expect(fieldHasValue('')).to.be.false;
      });
      it('returns false when given null', () => {
        expect(fieldHasValue(null)).to.be.false;
      });
      it('returns false when given undefined', () => {
        expect(fieldHasValue(undefined)).to.be.false;
      });
    });

    describe('all arrays empty', () => {
      it('returns true when all child arrays are empty', () => {
        const item = { array1: ['', ''], array2: [], array3: [''] };
        expect(allArraysEmpty(item)).to.be.true;
      });

      it('returns false when some fields are not empty', () => {
        const item = { array1: [''], array2: ['not empty'] };
        expect(allArraysEmpty(item)).to.be.false;
      });

      it('returns true when object is empty', () => {
        const item = {};
        expect(allArraysEmpty(item)).to.be.true;
      });
    });

    describe('all fields empty', () => {
      it('returns true when all fields are empty', () => {
        const item = { field1: '', field2: null };
        expect(allFieldsEmpty(item)).to.be.true;
      });

      it('returns false when some fields are not empty', () => {
        const item = { field1: '', field2: 'not empty' };
        expect(allFieldsEmpty(item)).to.be.false;
      });

      it('returns true when object is empty', () => {
        const item = {};
        expect(allFieldsEmpty(item)).to.be.true;
      });
    });
  });
});
