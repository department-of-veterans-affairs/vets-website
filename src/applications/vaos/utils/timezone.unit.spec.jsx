import { expect } from 'chai';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneAbbrFromApi,
  getTimezoneByFacilityId,
  getTimezoneDescByFacilityId,
  getTimezoneNameFromAbbr,
  stripDST,
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
      expect(getTimezoneDescByFacilityId('402')).to.equal('Eastern time (ET)');
      expect(getTimezoneDescByFacilityId('436')).to.equal('Mountain time (MT)');
      expect(getTimezoneDescByFacilityId('437')).to.equal('Central time (CT)');
      expect(getTimezoneDescByFacilityId('459')).to.equal('Hawaii time (HT)');
      expect(getTimezoneDescByFacilityId('463')).to.equal('Alaska time (AKT)');
      expect(getTimezoneDescByFacilityId('570')).to.equal('Pacific time (PT)');
      expect(getTimezoneDescByFacilityId('649')).to.equal('Mountain time (MT)');
      expect(getTimezoneDescByFacilityId('672')).to.equal('Atlantic time (AT)');
    });
    it('should return the correct description', () => {
      expect(getTimezoneDescByFacilityId('4022')).to.equal('Eastern time (ET)');
    });
    it('should return null', () => {
      expect(getTimezoneDescByFacilityId('0402')).to.be.null;
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
    });
  });

  describe('getTimezoneByFacilityId', () => {
    it('should return the correct IANA timezone', () => {
      expect(getTimezoneByFacilityId(402)).to.equal('America/New_York');
      expect(getTimezoneByFacilityId(437)).to.equal('America/Chicago');
      expect(getTimezoneByFacilityId(442)).to.equal('America/Denver');
      expect(getTimezoneByFacilityId(570)).to.equal('America/Los_Angeles');
      expect(getTimezoneByFacilityId(463)).to.equal('America/Anchorage');
      expect(getTimezoneByFacilityId(459)).to.equal('Pacific/Honolulu');
      expect(getTimezoneByFacilityId('459GE')).to.equal('Pacific/Guam');
      expect(getTimezoneByFacilityId('459GF')).to.equal('Pacific/Pago_Pago');
      expect(getTimezoneByFacilityId(672)).to.equal('America/Puerto_Rico');
      expect(getTimezoneByFacilityId('672GA')).to.equal('America/St_Thomas');
    });

    it('should return null for an unknown id', () => {
      expect(getTimezoneByFacilityId(null)).to.be.null;
      expect(getTimezoneByFacilityId(undefined)).to.be.null;
    });
  });
});
