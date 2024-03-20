import { expect } from 'chai';
import { getTimezoneAbbrByFacilityId, stripDST } from '../../utils/timezone';

describe('VAOS Utils: timezone', () => {
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
      let tz = stripDST('MST');
      expect(tz).to.equal('MT');

      tz = stripDST('AKST');
      expect(tz).to.equal('AKT');
    });
  });
});
