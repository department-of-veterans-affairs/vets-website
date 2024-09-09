import { expect } from 'chai';
import { formatAddress } from '../../helpers';

describe('formatAddress', () => {
  it('should format address with city, state, and zip code', () => {
    const address = { city: 'Los Angeles', stateCode: 'CA', zipCode: '90001' };
    const result = formatAddress(address);
    expect(result).to.equal('Los Angeles, CA 90001');
  });

  it('should format address with city and state', () => {
    const address = { city: 'Los Angeles', stateCode: 'CA' };
    const result = formatAddress(address);
    expect(result).to.equal('Los Angeles, CA');
  });

  it('should format address with city and zip code', () => {
    const address = { city: 'Los Angeles' };
    const result = formatAddress(address);
    expect(result).to.equal('Los Angeles');
  });

  it('should return an empty string for an empty address', () => {
    const address = {};
    const result = formatAddress(address);
    expect(result).to.equal('');
  });

  it('should handle null or undefined address', () => {
    expect(formatAddress(null)).to.equal('');
    expect(formatAddress(undefined)).to.equal('');
  });
});
