// Node modules.
import { expect } from 'chai';
// Relative imports.
import { formatPromoBannerType } from '.';

describe('Promo Banners (helpers)', () => {
  describe('formatPromoBannerType', () => {
    it('works with various arguments', () => {
      // Assertions.
      expect(formatPromoBannerType()).to.equal('announcement');
      expect(formatPromoBannerType('announcements')).to.equal('announcement');
      expect(formatPromoBannerType('email-signup')).to.equal('email-signup');
      expect(formatPromoBannerType('news-stories')).to.equal('news');
    });
  });
});
