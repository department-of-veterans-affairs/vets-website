import { expect } from 'chai';
import { getDestinationDomain } from '../../utilities';

describe('getDestinationDomain', () => {
  let oldLocation;

  beforeEach(() => {
    oldLocation = document.location.href;

    global.dom.reconfigure({ url: 'https://www.currentsite.com' });
  });

  afterEach(() => {
    global.dom.reconfigure({ url: oldLocation });
  });

  it('returns the hostname for a full URL', () => {
    const url = 'https://www.example.com/page';
    expect(getDestinationDomain(url)).to.equal('www.example.com');
  });

  it('returns the hostname for a URL with a different domain', () => {
    const url = 'https://www.anotherdomain.com/page';
    expect(getDestinationDomain(url)).to.equal('www.anotherdomain.com');
  });

  it('resolves relative URLs based on document.location.href', () => {
    const relativeUrl = '/local/page';
    expect(getDestinationDomain(relativeUrl)).to.equal('www.currentsite.com');
  });
});
