import { expect } from 'chai';
import { getNonActiveLinkUrls } from '../utilities/helpers';

describe('getNonActiveLinkUrls util', () => {
  it('should return non-english urls (-tag, ) for "en" language code', () => {
    const result = getNonActiveLinkUrls('en');

    result.forEach(url => {
      expect(/(esp|tag)/i.test(url)).to.equal(true);
    });

    expect(result.length).to.equal(37);
  });

  it('should not return any "-esp" suffixed links when "es" is the active language code', () => {
    const result = getNonActiveLinkUrls('es');

    result.forEach(url => {
      expect(/(esp)/i.test(url)).to.equal(false);
    });

    expect(result.length).to.equal(37);
  });

  it('should not return any "-tag" suffixed links when "tl" is the active language code', () => {
    const result = getNonActiveLinkUrls('tl');

    result.forEach(url => {
      expect(/(tag)/i.test(url)).to.equal(false);
    });

    expect(result.length).to.equal(62);
  });
});
