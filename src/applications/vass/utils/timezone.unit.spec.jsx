import { expect } from 'chai';
import {
  stripDST,
  mapGmtToAbbreviation,
  getTimezoneDescByTimeZoneString,
} from './timezone';

describe('VASS Utils: timezone', () => {
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
