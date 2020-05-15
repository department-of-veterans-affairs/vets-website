import { expect } from 'chai';

import isVATeamSiteSubdomain from '../../environment/va-subdomain';

describe('brand-consolidation/va-subdomain', () => {
  const oldWindow = window;

  after(() => {
    window = oldWindow; // eslint-disable-line no-global-assign
  });

  it('returns false if is not a VA subdomain', () => {
    // eslint-disable-next-line no-global-assign
    window = {
      location: {
        hostname: 'www.va.gov',
      },
    };

    expect(isVATeamSiteSubdomain()).to.be.false;
  });

  it('returns true if is a VA subdomain', () => {
    // eslint-disable-next-line no-global-assign
    window = {
      location: {
        hostname: 'www.BENEFITS.va.gov',
      },
    };

    expect(isVATeamSiteSubdomain()).to.be.true;
  });
});
