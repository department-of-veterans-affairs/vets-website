import { expect } from 'chai';
import { getTimezoneAbbrByFacilityId, stripDST } from '../../utils/timezone';

describe('timezone util', () => {
  it('should return the correct abbreviation', () => {
    const abbr = getTimezoneAbbrByFacilityId(605);
    expect(abbr).to.equal('PT');
  });

  it('should not strip middle char if not an american zone', () => {
    const abbr = getTimezoneAbbrByFacilityId(358); // manila
    expect(abbr.length).to.equal(3);
  });

  describe('stripDST', () => {
    it('should convert lower-48 tz to two chars', () => {
      const tz = stripDST('MST');
      expect(tz).to.equal('MT');
    });

    it('should skip 4 digit timezones', () => {
      const tz = stripDST('AKST');
      expect(tz).to.equal('AKST');
    });
  });
});
