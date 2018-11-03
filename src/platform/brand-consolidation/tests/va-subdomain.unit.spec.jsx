import { expect } from 'chai';

import isVASubdomain from '../va-subdomain';

describe('brand-consolidation/va-subdomain', () => {
  const oldWindow = window;

  after(() => {
    window = oldWindow; // eslint-disable-line no-global-assign
  });

  it('returns false if is not a VA subdomain', () => {
    window = { // eslint-disable-line
      location: {
        hostname: 'www.va.gov',
      },
    };

    expect(isVASubdomain()).to.be.false;
  });

  it('returns true if is a VA subdomain', () => {
    window = { // eslint-disable-line
      location: {
        hostname: 'www.benefits.va.gov',
      },
    };

    expect(isVASubdomain()).to.be.true;
  });
});
