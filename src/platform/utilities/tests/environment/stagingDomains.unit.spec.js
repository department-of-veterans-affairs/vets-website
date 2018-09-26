import { expect } from 'chai';

import { replaceDomainsInData } from '../../environment/stagingDomains';

describe('Staging va.gov domain replacement', () => {
  describe('replaceDomainsInData', () => {
    it('should replace links in an array', () => {
      const data = [
        {
          href: 'www.cem.va.gov'
        }
      ];
      expect(replaceDomainsInData(data)).to.deep.equal([
        {
          href: 'staging.cem.va.gov'
        }
      ]);
    });

    it('should replace links in a nested array', () => {
      const data = [
        {
          someArray: [{
            href: 'www.cem.va.gov/testing',
          }, {
            other: 'www.cem.va.gov',
          }]
        }
      ];

      expect(replaceDomainsInData(data)).to.deep.equal([
        {
          someArray: [{
            href: 'staging.cem.va.gov/testing',
          }, {
            other: 'www.cem.va.gov',
          }]
        }
      ]);
    });

    it('should replace links in an object', () => {
      const data = {
        href: 'www.cem.va.gov/testing',
        other: 'www.cem.va.gov',
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        href: 'staging.cem.va.gov/testing',
        other: 'www.cem.va.gov',
      });
    });

    it('should replaces links in a nested object', () => {
      const data = {
        test: 'www.cem.va.gov/testing',
        other: {
          href: 'www.cem.va.gov',
        }
      };

      expect(replaceDomainsInData(data)).to.deep.equal({
        test: 'www.cem.va.gov/testing',
        other: {
          href: 'staging.cem.va.gov',
        }
      });
    });
  });
});

