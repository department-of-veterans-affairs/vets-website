import { expect } from 'chai';
import { getConfigFromUrl } from '../utilities/helpers';
import { ALL_LANGUAGES, TRANSLATED_LANGUAGES } from '../utilities/constants';

describe('getConfigFromUrl util', () => {
  it('should return "en" code for non-matching url patterns', () => {
    const paths = [
      '/health-care/covid-19-vaccine/',
      '/some-english-page',
      '/',
      '',
      null,
    ];

    for (const path of paths) {
      expect(getConfigFromUrl(path, TRANSLATED_LANGUAGES)).to.equal(
        ALL_LANGUAGES[0],
      );
    }
  });

  it('should return "es" code for various url patterns', () => {
    const paths = [
      'https://va.gov/health-care/covid-19-vaccine-esp/',
      'https://va.gov/some-espanol-page',
      'https://va.gov/no-forward-slash-esp',
    ];

    for (const path of paths) {
      expect(getConfigFromUrl(path, TRANSLATED_LANGUAGES)).to.equal(
        ALL_LANGUAGES[1],
      );
    }
  });

  it('should return "tl" code for various url patterns', () => {
    const paths = [
      'https://va.gov/health-care/covid-19-vaccine-tag/',
      'https://va.gov/some-tagalog-page',
      'https://va.gov/no-forward-slash-tag',
    ];

    for (const path of paths) {
      expect(getConfigFromUrl(path, TRANSLATED_LANGUAGES)).to.equal(
        ALL_LANGUAGES[2],
      );
    }
  });
});
