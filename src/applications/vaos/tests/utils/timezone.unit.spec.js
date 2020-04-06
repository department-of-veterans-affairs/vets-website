import { getTimezoneAbbrBySystemId, stripDST } from '../../utils/timezone';

describe('timezone util', () => {
  it('should return the correct abbreviation', () => {
    const abbr = getTimezoneAbbrBySystemId(605);
    expect(abbr).toBe('PT');
  });

  it('should not strip middle char if not an american zone', () => {
    const abbr = getTimezoneAbbrBySystemId(358); // manila
    expect(abbr).toBe('PHT');
  });

  describe('stripDST', () => {
    it('should convert lower-48 tz to two chars', () => {
      const tz = stripDST('MST');
      expect(tz).toBe('MT');
    });

    it('should skip 4 digit timezones', () => {
      const tz = stripDST('AKST');
      expect(tz).toBe('AKST');
    });
  });
});
