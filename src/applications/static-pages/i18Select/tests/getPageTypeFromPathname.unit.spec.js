import { expect } from 'chai';
import { getPageTypeFromPathname } from '../utilities/helpers';
import BASE_URLS from '../utilities/urls';

describe('getPageTypeFromPathname util', () => {
  it('should return english config for non-matching language codes and "en"', () => {
    const pathname = '/a-path-non-matching-path/';

    expect(getPageTypeFromPathname(pathname)).to.equal(null);
  });

  it('should return "faq" when given one of the available pathnames', () => {
    const pageType = 'faq';
    expect(getPageTypeFromPathname(BASE_URLS.faq.en)).to.equal(pageType);
    expect(getPageTypeFromPathname(BASE_URLS.faq.es)).to.equal(pageType);
    expect(getPageTypeFromPathname(BASE_URLS.faq.tl)).to.equal(pageType);
  });

  it('should return "vaccine" when given one of the available pathnames', () => {
    const pageType = 'vaccine';
    expect(getPageTypeFromPathname(BASE_URLS.vaccine.en)).to.equal(pageType);
    expect(getPageTypeFromPathname(BASE_URLS.vaccine.es)).to.equal(pageType);
    expect(getPageTypeFromPathname(BASE_URLS.vaccine.tl)).to.equal(pageType);
  });
});
