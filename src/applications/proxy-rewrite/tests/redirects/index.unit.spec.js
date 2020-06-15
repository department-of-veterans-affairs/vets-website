import fetch from 'node-fetch';
import { expect } from 'chai';

import redirectIfNecessary from '../../redirects';
import redirects from '../../redirects/crossDomainRedirects.json';

describe('Redirect replaced pages', () => {
  it('should redirect when page matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/compensation/types-disability.asp',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('.gov/disability/')).to.be.true;
  });

  it('should not redirect when there are no matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/nothing/',
      },
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
  });
});

describe('Validate crossDomainRedirects.json', () => {
  // This string is technically the prod S3 bucket domain plus the path to this JavaScript bundle
  // generated via Webpack so we can technically derive this from shared constants.
  // However, it's hardcoded into TeamSite bundles as this URL, so hardcoding it instead adds that extra
  // validation in case one of the constants changed one day.

  const REDIRECT_ENTRY_SCRIPT =
    'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/proxy-rewrite.entry.js';

  const redirectsBySource = redirects.reduce((grouped, redirect) => {
    const fullPath = `https://${redirect.domain}${redirect.src}`;
    const items = grouped[fullPath] || [];
    return {
      ...grouped,
      [fullPath]: items.concat(redirect.dest),
    };
  }, {});

  Object.entries(redirectsBySource).forEach(([fullSource, destinations]) => {
    it(`${fullSource} is a valid URL`, () => {
      const url = new URL(fullSource);
      expect(fullSource).to.be.equal(url.href);
    });

    it(`${fullSource} has a unique valid destination`, () => {
      expect(destinations.length).to.be.equal(1);
      const destUrl = new URL(destinations[0], 'https://www.va.gov');
      expect(destinations[0]).to.be.equal(destUrl.pathname);
    });

    it(`${fullSource} contains the proxy-rewrite JavaScript bundle`, async () => {
      const response = await fetch(fullSource);
      const pageContents = await response.text();
      const redirectEntryIncluded = pageContents.includes(
        REDIRECT_ENTRY_SCRIPT,
      );

      expect(redirectEntryIncluded).to.be.true;
    });
  });
});
