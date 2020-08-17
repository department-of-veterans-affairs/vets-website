import { expect } from 'chai';

import isVATeamSiteSubdomain from '../../environment/va-subdomain';

describe('brand-consolidation/va-subdomain', () => {
  it('returns false if is not a VA subdomain', () => {
    const oldWindow = window;
    // eslint-disable-next-line no-global-assign
    window = {
      location: {
        hostname: 'www.va.gov',
      },
    };

    expect(isVATeamSiteSubdomain()).to.be.false;
    window = oldWindow; // eslint-disable-line no-global-assign
  });

  it('returns true if is a VA subdomain', () => {
    const oldWindow = window;
    // eslint-disable-next-line no-global-assign
    window = {
      location: {
        hostname: 'www.BENEFITS.va.gov',
      },
    };

    expect(isVATeamSiteSubdomain()).to.be.true;
    window = oldWindow; // eslint-disable-line no-global-assign
  });
});
