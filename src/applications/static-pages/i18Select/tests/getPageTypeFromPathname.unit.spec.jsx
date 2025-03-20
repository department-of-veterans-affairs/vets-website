import { expect } from 'chai';
import { getPageTypeFromPathname } from '../utilities/helpers';
import BASE_URLS from '../utilities/urls';

describe('getPageTypeFromPathname util', () => {
  it('should return null when a non-matching pathname is provided', () => {
    const pathname = '/a-path-non-matching-path/';

    expect(getPageTypeFromPathname(pathname)).to.equal(null);
  });

  it('should return correct page type based on a pathname', () => {
    const pageTypes = ['faq', 'vaccine', 'booster', 'vaccineRecord', 'about'];

    pageTypes.forEach(pageType => {
      expect(getPageTypeFromPathname(BASE_URLS[pageType].en)).to.equal(
        pageType,
      );
      expect(getPageTypeFromPathname(BASE_URLS[pageType].es)).to.equal(
        pageType,
      );
      expect(getPageTypeFromPathname(BASE_URLS[pageType].tl)).to.equal(
        pageType,
      );
    });
  });
});
