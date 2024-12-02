import { expect } from 'chai';
import { stripTrailingSlash } from '../utilities/helpers';

describe('stripTrailingSlash util', () => {
  it('should remove "/" at the end of strings', () => {
    const urls = [
      '/health-care/covid-19-vaccine/',
      '/some-english-page/',
      '/',
      '',
      null,
    ];

    for (const url of urls) {
      const stripped = stripTrailingSlash(url);
      expect(stripped.endsWith('/')).to.equal(false);
    }
  });
});
