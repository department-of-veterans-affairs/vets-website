import { expect } from 'chai';
import { getTimezoneAbbrBySystemId, stripDST } from '../../utils/timezone';

describe('timezone util', () => {
  it('should return the correct abbreviation', () => {
    const abbr = getTimezoneAbbrBySystemId(605);
    expect(abbr).to.equal('PT');
  });

  it('should not strip middle char if not an american zone', () => {
    const abbr = getTimezoneAbbrBySystemId(358); // manila
    expect(abbr).to.equal('PHT');
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
