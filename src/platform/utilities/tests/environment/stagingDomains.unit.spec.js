import { expect } from 'chai';

import { replaceDomainsInData } from '../../environment/stagingDomains';

let currentEnv = '';
if (
  global.__BUILDTYPE__.includes('staging') ||
  global.__BUILDTYPE__ === 'preview'
) {
  currentEnv = 'https://staging.va.gov';
}
if (global.__BUILDTYPE__.includes('production')) {
  currentEnv = 'https://www.va.gov';
}

describe('Staging va.gov domain replacement', () => {
  describe('replaceDomainsInData', () => {
    it('should replace links in an array', () => {
      const data = [
        {
          href: 'https://www.va.gov/',
        },
      ];
      expect(replaceDomainsInData(data)).to.deep.equal([
        {
          href: `${currentEnv}/`,
        },
      ]);
    });

    it('should replace links in a nested array', () => {
      const data = [
        {
          someArray: [
            {
              href: 'https://www.va.gov/testing',
            },
            {
              other: 'www.va.gov',
            },
          ],
        },
      ];

      expect(replaceDomainsInData(data)).to.deep.equal([
        {
          someArray: [
            {
              href: `${currentEnv}/testing`,
            },
            {
              other: 'www.va.gov',
            },
          ],
        },
      ]);
    });

    it('should replace links in an object', () => {
      const data = {
        href: 'https://www.va.gov/testing',
        other: 'www.va.gov',
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        href: `${currentEnv}/testing`,
        other: 'www.va.gov',
      });
    });

    it('should replaces links in a nested object', () => {
      const data = {
        test: 'https://www.va.gov/testing',
        other: {
          href: 'https://www.va.gov/',
        },
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        test: `https://www.va.gov/testing`,
        other: {
          href: `${currentEnv}/`,
        },
      });
    });
  });
});
