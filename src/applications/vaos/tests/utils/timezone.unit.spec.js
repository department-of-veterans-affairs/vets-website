import { expect } from 'chai';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone';

describe('timezone util', () => {
  it('should return the correct abbreviation', () => {
    const abbr = getTimezoneAbbrBySystemId(605);
    expect(abbr).to.equal('PT');
  });

  it('should not strip middle char if not an american zone', () => {
    const abbr = getTimezoneAbbrBySystemId(358); // manila
    expect(abbr).to.equal('PHT');
  });
});
