import { expect } from 'chai';
import { getDestinationDomain } from '../../utilities';

describe('getDestinationDomain', () => {
  before(() => {
    global.document = {
      location: {
        href: 'https://www.currentsite.com',
      },
    };
  });

  it('returns va.gov for URLs containing va.gov', () => {
    const url = 'https://www.example.va.gov/page';
    expect(getDestinationDomain(url)).to.equal('va.gov');
  });

  it('returns mhvnp for URLs containing mhvnp', () => {
    const url = 'https://www.example.mhvnp.com/page';
    expect(getDestinationDomain(url)).to.equal('mhvnp');
  });

  it('returns hostname for URLs not containing va.gov or mhvnp', () => {
    const url = 'https://www.othersite.com';
    expect(getDestinationDomain(url)).to.equal('www.othersite.com');
  });

  it('resolves relative URLs based on document.location.href', () => {
    const relativeUrl = '/local/page';
    expect(getDestinationDomain(relativeUrl)).to.equal('www.currentsite.com');
  });
});
