import { expect } from 'chai';
import { getTimezoneBySystemId } from '../../utils/timezone';

describe('timezone util', () => {
  it('should return the correct abbreviation', () => {
    const abbr = getTimezoneBySystemId(605);
    expect(abbr).to.equal('PT');
  });

  it('should not strip middle char if not an american zone', () => {
    const abbr = getTimezoneBySystemId(358); // manila
    expect(abbr).to.equal('PHT');
  });
});
