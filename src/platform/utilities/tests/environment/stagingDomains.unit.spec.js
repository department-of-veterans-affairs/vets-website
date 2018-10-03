import { expect } from 'chai';

import { replaceDomainsInData } from '../../environment/stagingDomains';

let currentEnv = 'dev';
if (
  global.__BUILDTYPE__.includes('staging') ||
  global.__BUILDTYPE__ === 'preview'
) {
  currentEnv = 'staging';
}

describe('Staging va.gov domain replacement', () => {
  describe('replaceDomainsInData', () => {
    it('should replace links in an array', () => {
      const data = [
        {
          href: 'www.va.gov',
        },
      ];
      expect(replaceDomainsInData(data)).to.deep.equal([
        {
          href: `${currentEnv}.va.gov`,
        },
      ]);
    });

    it('should replace links in a nested array', () => {
      const data = [
        {
          someArray: [
            {
              href: 'www.va.gov/testing',
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
              href: `${currentEnv}.va.gov/testing`,
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
        href: 'www.va.gov/testing',
        other: 'www.va.gov',
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        href: `${currentEnv}.va.gov/testing`,
        other: 'www.va.gov',
      });
    });

    it('should replaces links in a nested object', () => {
      const data = {
        test: 'www.va.gov/testing',
        other: {
          href: 'www.va.gov',
        },
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        test: 'www.va.gov/testing',
        other: {
          href: `${currentEnv}.va.gov`,
        },
      });
    });
  });
});
