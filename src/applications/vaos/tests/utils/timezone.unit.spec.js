import { expect } from 'chai';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneNameFromAbbr,
  stripDST,
} from '../../utils/timezone';

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
    });

    it('should not strip middle char if not an american zone', () => {
      const abbr = getTimezoneAbbrByFacilityId(358); // manila
      expect(abbr.length).to.equal(3);
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
});
