import { expect } from 'chai';

import isVATeamSiteSubdomain from '../va-subdomain';

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

    expect(isVATeamSiteSubdomain()).to.be.false;
  });

  it('returns true if is a VA subdomain', () => {
    window = { // eslint-disable-line
      location: {
        hostname: 'www.BENEFITS.va.gov',
      },
    };

    expect(isVATeamSiteSubdomain()).to.be.true;
  });
});
