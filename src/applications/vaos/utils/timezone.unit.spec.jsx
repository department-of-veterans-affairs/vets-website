import { expect } from 'chai';
import Sinon from 'sinon';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneAbbrFromApi,
  getTimezoneByFacilityId,
  getTimezoneDescByFacilityId,
  getTimezoneNameFromAbbr,
  mapGmtToAbbreviation,
  stripDST,
  getFormattedTimezoneAbbr,
  getTimezoneDescByTimeZoneString,
} from './timezone';

describe('VAOS Utils: timezone', () => {
  describe('getTimezoneAbbrByFacilityId', () => {
    it('should return the correct abbreviation', () => {
      expect(getTimezoneAbbrByFacilityId(402)).to.equal('ET'); // America/New_York
      expect(getTimezoneAbbrByFacilityId(437)).to.equal('CT'); // America/Chicago
      expect(getTimezoneAbbrByFacilityId(442)).to.equal('MT'); // America/Denver
      expect(getTimezoneAbbrByFacilityId(570)).to.equal('PT'); // America/Los_Angeles
      expect(getTimezoneAbbrByFacilityId(463)).to.equal('AKT'); // America/Anchorage
      expect(getTimezoneAbbrByFacilityId(459)).to.equal('HT'); // Pacific/Honolulu
      expect(getTimezoneAbbrByFacilityId('459GE')).to.equal('ChT'); // Pacific/Guam
      expect(getTimezoneAbbrByFacilityId('459GF')).to.equal('ST'); // Pacific/Pago_Pago
      expect(getTimezoneAbbrByFacilityId(672)).to.equal('AT'); // America/Puerto_Rico
      expect(getTimezoneAbbrByFacilityId('672GA')).to.equal('AT'); // America/St_Thomas
    });
  });

  describe('stripDST', () => {
    it('should convert lower-48 tz to two chars', () => {
      expect(stripDST('EST')).to.equal('ET');
      expect(stripDST('EDT')).to.equal('ET');
      expect(stripDST('MST')).to.equal('MT');
      expect(stripDST('MDT')).to.equal('MT');
      expect(stripDST('CST')).to.equal('CT');
      expect(stripDST('CDT')).to.equal('CT');
      expect(stripDST('PST')).to.equal('PT');
      expect(stripDST('PDT')).to.equal('PT');
      expect(stripDST('AKST')).to.equal('AKT');
      expect(stripDST('AKDT')).to.equal('AKT');
      expect(stripDST('HST')).to.equal('HT');
      expect(stripDST('SST')).to.equal('ST');
      expect(stripDST('ChST')).to.equal('ChT');
      expect(stripDST('AST')).to.equal('AT');
    });

    it('should convert just the timezone abbreviation', () => {
      expect(stripDST('August 1st 2024 9:15 PM ADT')).to.equal(
        'August 1st 2024 9:15 PM AT',
      );
    });

    it('should return original abbreviation if it is already stripped or unrecognized', () => {
      expect(stripDST('HKT')).to.equal('HKT');
      expect(stripDST('PHT')).to.equal('PHT');
      expect(stripDST('ET')).to.equal('ET');
      expect(stripDST('MT')).to.equal('MT');
      expect(stripDST('CT')).to.equal('CT');
      expect(stripDST('PT')).to.equal('PT');
    });
  });

  describe('mapGmtToAbbreviation', () => {
    it('should map GMT timezones to abbreviations', () => {
      expect(mapGmtToAbbreviation('GMT+8')).to.equal('PHT');
      expect(mapGmtToAbbreviation('GMT-11')).to.equal('ST');
      expect(mapGmtToAbbreviation('GMT+10')).to.equal('ChT');
    });

    it('should return original abbreviation for unmapped GMT timezones', () => {
      expect(mapGmtToAbbreviation('GMT+5')).to.equal('GMT+5');
      expect(mapGmtToAbbreviation('GMT-7')).to.equal('GMT-7');
    });

    it('should return original abbreviation for non-GMT timezones', () => {
      expect(mapGmtToAbbreviation('EST')).to.equal('EST');
      expect(mapGmtToAbbreviation('PST')).to.equal('PST');
      expect(mapGmtToAbbreviation('CST')).to.equal('CST');
    });

    it('should handle null and undefined inputs', () => {
      expect(mapGmtToAbbreviation(null)).to.be.null;
      expect(mapGmtToAbbreviation(undefined)).to.be.undefined;
    });
  });

  describe('getTimezoneNameFromAbbr', () => {
    it('should return the correct timezone', () => {
      expect(getTimezoneNameFromAbbr('PHT')).to.equal('Philippine time');
      expect(getTimezoneNameFromAbbr('ET')).to.equal('Eastern time');
      expect(getTimezoneNameFromAbbr('CT')).to.equal('Central time');
      expect(getTimezoneNameFromAbbr('MT')).to.equal('Mountain time');
      expect(getTimezoneNameFromAbbr('PT')).to.equal('Pacific time');
      expect(getTimezoneNameFromAbbr('AKT')).to.equal('Alaska time');
      expect(getTimezoneNameFromAbbr('HT')).to.equal('Hawaii time');
      expect(getTimezoneNameFromAbbr('ST')).to.equal('Samoa time');
      expect(getTimezoneNameFromAbbr('ChT')).to.equal('Chamorro time');
      expect(getTimezoneNameFromAbbr('AT')).to.equal('Atlantic time');
    });

    it('should return abbreviation if no match', () => {
      expect(getTimezoneNameFromAbbr('HKT')).to.equal('HKT');
    });
  });

  describe('getTimezoneDescByFacilityId', () => {
    it('should return the correct description', () => {
      expect(getTimezoneDescByFacilityId('358')).to.equal(
        'Philippine time (PHT)',
      );
      expect(getTimezoneDescByFacilityId('402')).to.equal('Eastern time (ET)');
      expect(getTimezoneDescByFacilityId('436')).to.equal('Mountain time (MT)');
      expect(getTimezoneDescByFacilityId('437')).to.equal('Central time (CT)');
      expect(getTimezoneDescByFacilityId('459')).to.equal('Hawaii time (HT)');
      expect(getTimezoneDescByFacilityId('463')).to.equal('Alaska time (AKT)');
      expect(getTimezoneDescByFacilityId('570')).to.equal('Pacific time (PT)');
      expect(getTimezoneDescByFacilityId('649')).to.equal('Mountain time (MT)');
      expect(getTimezoneDescByFacilityId('672')).to.equal('Atlantic time (AT)');
      expect(getTimezoneDescByFacilityId('672A')).to.equal(
        'Atlantic time (AT)',
      );
      expect(getTimezoneDescByFacilityId('459GE')).to.equal(
        'Chamorro time (ChT)',
      );
      expect(getTimezoneDescByFacilityId('459GF')).to.equal('Samoa time (ST)');
      expect(getTimezoneDescByFacilityId('459GH')).to.equal(
        'Chamorro time (ChT)',
      );
    });
    it('should return the correct description', () => {
      expect(getTimezoneDescByFacilityId('4022')).to.equal('Eastern time (ET)');
    });
    it('should return null', () => {
      expect(getTimezoneDescByFacilityId('0402')).to.be.null;
    });
    it('should return the timezone for users current location for bad facility id', () => {
      expect(getTimezoneDescByFacilityId(null, true)).not.be.null;
    });
  });

  describe('getTimezoneAbbrFromApi', () => {
    it('should return the correct abbreviation', () => {
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/New_York',
        }),
      ).to.equal('ET');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/Chicago',
        }),
      ).to.equal('CT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'Pacific/Honolulu',
        }),
      ).to.equal('HT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/Anchorage',
        }),
      ).to.equal('AKT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/Los_Angeles',
        }),
      ).to.equal('PT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/Phoenix',
        }),
      ).to.equal('MT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'America/Puerto_Rico',
        }),
      ).to.equal('AT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'Asia/Manila',
        }),
      ).to.equal('PHT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'Pacific/Guam',
        }),
      ).to.equal('ChT');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'Pacific/Pago_Pago',
        }),
      ).to.equal('ST');
      expect(
        getTimezoneAbbrFromApi({
          start: new Date(),
          timezone: 'Pacific/Saipan',
        }),
      ).to.equal('ChT');
    });
  });

  describe('getTimezoneByFacilityId', () => {
    it('should return the correct IANA timezone', () => {
      expect(getTimezoneByFacilityId('358')).to.equal('Asia/Manila');
      expect(getTimezoneByFacilityId(402)).to.equal('America/New_York');
      expect(getTimezoneByFacilityId(437)).to.equal('America/Chicago');
      expect(getTimezoneByFacilityId(442)).to.equal('America/Denver');
      expect(getTimezoneByFacilityId(570)).to.equal('America/Los_Angeles');
      expect(getTimezoneByFacilityId(463)).to.equal('America/Anchorage');
      expect(getTimezoneByFacilityId(459)).to.equal('Pacific/Honolulu');
      expect(getTimezoneByFacilityId('459GE')).to.equal('Pacific/Guam');
      expect(getTimezoneByFacilityId('459GF')).to.equal('Pacific/Pago_Pago');
      expect(getTimezoneByFacilityId('459GH')).to.equal('Pacific/Saipan');
      expect(getTimezoneByFacilityId(672)).to.equal('America/Puerto_Rico');
      expect(getTimezoneByFacilityId('672GA')).to.equal('America/St_Thomas');
    });

    it('should return null for an unknown id', () => {
      expect(getTimezoneByFacilityId(null)).to.be.null;
      expect(getTimezoneByFacilityId(undefined)).to.be.null;
    });

    it('should return the timezone for users current location for bad facility id', () => {
      const stub = Sinon.stub(Intl, 'DateTimeFormat');
      stub.returns({
        resolvedOptions() {
          return { timeZone: 'America/Chicago' };
        },
      });

      expect(getTimezoneByFacilityId(null, true)).to.equal('America/Chicago');
      stub.restore();
    });
  });

  describe('getFormattedTimezoneAbbr', () => {
    it('should return formatted timezone abbreviation with DST stripped', () => {
      const date = new Date('2024-07-15T14:30:00Z'); // Summer date
      const winterDate = new Date('2024-01-15T14:30:00Z'); // Winter date

      // Test major US timezones
      expect(getFormattedTimezoneAbbr(date, 'America/New_York')).to.equal('ET');
      expect(getFormattedTimezoneAbbr(date, 'America/Chicago')).to.equal('CT');
      expect(getFormattedTimezoneAbbr(date, 'America/Denver')).to.equal('MT');
      expect(getFormattedTimezoneAbbr(date, 'America/Los_Angeles')).to.equal(
        'PT',
      );
      expect(getFormattedTimezoneAbbr(date, 'America/Anchorage')).to.equal(
        'AKT',
      );
      expect(getFormattedTimezoneAbbr(date, 'Pacific/Honolulu')).to.equal('HT');

      // Test with winter dates to ensure DST handling
      expect(getFormattedTimezoneAbbr(winterDate, 'America/New_York')).to.equal(
        'ET',
      );
      expect(getFormattedTimezoneAbbr(winterDate, 'America/Chicago')).to.equal(
        'CT',
      );
    });

    it('should handle GMT timezone mappings', () => {
      const date = new Date('2024-07-15T14:30:00Z');

      expect(getFormattedTimezoneAbbr(date, 'Asia/Manila')).to.equal('PHT');
      expect(getFormattedTimezoneAbbr(date, 'Pacific/Guam')).to.equal('ChT');
      expect(getFormattedTimezoneAbbr(date, 'Pacific/Pago_Pago')).to.equal(
        'ST',
      );
    });

    it('should handle Atlantic and Puerto Rico timezones', () => {
      const date = new Date('2024-07-15T14:30:00Z');

      expect(getFormattedTimezoneAbbr(date, 'America/Puerto_Rico')).to.equal(
        'AT',
      );
      expect(getFormattedTimezoneAbbr(date, 'America/St_Thomas')).to.equal(
        'AT',
      );
    });

    it('should handle string date inputs', () => {
      const dateString = '2024-07-15T14:30:00Z';

      expect(getFormattedTimezoneAbbr(dateString, 'America/New_York')).to.equal(
        'ET',
      );
      expect(getFormattedTimezoneAbbr(dateString, 'Pacific/Honolulu')).to.equal(
        'HT',
      );
    });

    it('should handle edge cases', () => {
      const date = new Date('2024-07-15T14:30:00Z');

      // Test with timezone that might return GMT format
      const result = getFormattedTimezoneAbbr(date, 'UTC');
      expect(result).to.be.a('string');
      expect(result.length).to.be.greaterThan(0);
    });
  });

  describe('getTimezoneDescByTimeZoneString', () => {
    it('should return the correct description for a valid IANA timezone string', () => {
      expect(getTimezoneDescByTimeZoneString('America/New_York')).to.equal(
        'Eastern time (ET)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Chicago')).to.equal(
        'Central time (CT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Denver')).to.equal(
        'Mountain time (MT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Los_Angeles')).to.equal(
        'Pacific time (PT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Phoenix')).to.equal(
        'Mountain time (MT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Anchorage')).to.equal(
        'Alaska time (AKT)',
      );
      expect(getTimezoneDescByTimeZoneString('Pacific/Honolulu')).to.equal(
        'Hawaii time (HT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Puerto_Rico')).to.equal(
        'Atlantic time (AT)',
      );
      expect(getTimezoneDescByTimeZoneString('America/St_Thomas')).to.equal(
        'Atlantic time (AT)',
      );
      expect(getTimezoneDescByTimeZoneString('Pacific/Guam')).to.equal(
        'Chamorro time (ChT)',
      );
      expect(getTimezoneDescByTimeZoneString('Pacific/Saipan')).to.equal(
        'Chamorro time (ChT)',
      );
      expect(getTimezoneDescByTimeZoneString('Pacific/Pago_Pago')).to.equal(
        'Samoa time (ST)',
      );
      expect(getTimezoneDescByTimeZoneString('Asia/Manila')).to.equal(
        'Philippine time (PHT)',
      );
    });

    it('should return abbreviation for unsupported timezones', () => {
      // Test with a timezone without DST that doesn't have a mapping in
      // TIMEZONE_LABELS and is not in GMT_TABLE_MAPPING
      const result = getTimezoneDescByTimeZoneString('Asia/Dubai');
      expect(result).to.equal('GMT+4');
    });

    it('should handle DST correctly by stripping daylight saving time indicators', () => {
      // Test with a summer date to ensure DST handling
      const originalNow = Date.now;
      Date.now = () => new Date('2024-07-15T12:00:00Z').getTime(); // Summer date

      expect(getTimezoneDescByTimeZoneString('America/New_York')).to.equal(
        'Eastern time (ET)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Chicago')).to.equal(
        'Central time (CT)',
      );

      // Test with a winter date
      Date.now = () => new Date('2024-01-15T12:00:00Z').getTime(); // Winter date

      expect(getTimezoneDescByTimeZoneString('America/New_York')).to.equal(
        'Eastern time (ET)',
      );
      expect(getTimezoneDescByTimeZoneString('America/Chicago')).to.equal(
        'Central time (CT)',
      );

      // Restore original Date.now
      Date.now = originalNow;
    });
  });
});
