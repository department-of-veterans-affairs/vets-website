import { expect } from 'chai';
import { getDestinationDomain } from '../../utilities';

describe('getDestinationDomain', () => {
  it('returns va.gov for URLs containing va.gov', () => {
    const url = 'https://www.example.va.gov/page';
    expect(getDestinationDomain(url)).to.equal('va.gov');
  });

  it('returns mhvnp for URLs containing mhvnp', () => {
    const url = 'https://www.example.mhvnp.com/page';
    expect(getDestinationDomain(url)).to.equal('mhvnp');
  });

  it('returns Unknown for URLs not containing va.gov or mhvnp', () => {
    const url = 'https://www.example.com';
    expect(getDestinationDomain(url)).to.equal('Unknown');
  });
});
