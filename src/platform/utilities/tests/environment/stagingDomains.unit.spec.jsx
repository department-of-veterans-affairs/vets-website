import { expect } from 'chai';

import HOSTNAMES from 'site/constants/hostnames';
import { replaceDomainsInData } from '../../environment/stagingDomains';

const currentEnv = `https://${HOSTNAMES[global.__BUILDTYPE__]}`;

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
