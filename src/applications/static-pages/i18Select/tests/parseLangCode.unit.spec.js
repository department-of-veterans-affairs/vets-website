import { expect } from 'chai';
import { parseLangCode } from '../hooks';

describe('parseLang util', () => {
  it('should return "es" code for various url patterns', () => {
    const paths = [
      '/health-care/covid-19-vaccine-esp/',
      '/some-espanol-page',
      '/no-forward-slash-esp',
    ];

    for (const path of paths) {
      expect(parseLangCode(path)).to.equal('es');
    }
  });

  it('should return "tl" code for various url patterns', () => {
    const paths = [
      '/health-care/covid-19-vaccine-tag/',
      '/some-tagalog-page',
      '/no-forward-slash-tag',
    ];

    for (const path of paths) {
      expect(parseLangCode(path)).to.equal('tl');
    }
  });

  it('should return "en" code for non-matching url patterns', () => {
    const paths = [
      '/health-care/covid-19-vaccine/',
      '/some-english-page',
      '/',
      '',
      null,
    ];

    for (const path of paths) {
      expect(parseLangCode(path)).to.equal('en');
    }
  });
});
