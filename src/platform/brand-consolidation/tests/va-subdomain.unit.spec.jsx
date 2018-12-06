import { expect } from 'chai';

import isVATeamSiteSubdomain from '../va-subdomain';

describe('brand-consolidation/va-subdomain', () => {
  const oldWindow = window;

  afterAll(() => {
    window = oldWindow; // eslint-disable-line no-global-assign
  });

  it('returns false if is not a VA subdomain', () => {
    /* eslint-disable no-undef */
    jsdom.reconfigure({
      url: 'https://www.va.gov',
    });
    /* eslint-enable no-undef */
    expect(isVATeamSiteSubdomain()).to.be.false;
  });

  it('returns true if is a VA subdomain', () => {
    /* eslint-disable no-undef */
    jsdom.reconfigure({
      url: 'https://www.BENEFITS.va.gov',
    });
    /* eslint-enable no-undef */
    expect(isVATeamSiteSubdomain()).to.be.true;
  });
});
