import { expect } from 'chai';
import { getNonActiveLinkUrls } from '../utilities/helpers';

describe('getNonActiveLinkUrls util', () => {
  it('should return non-english urls for "en" language code', () => {
    const result = getNonActiveLinkUrls('en');

    result.forEach(url => {
      expect(/(esp|tag)/i.test(url)).to.equal(true);
    });

    expect(result.length).to.equal(8);
  });

  it('should return correct urls for "es" language code', () => {
    const result = getNonActiveLinkUrls('es');

    result.forEach(url => {
      expect(/(esp)/i.test(url)).to.equal(false);
    });

    expect(result.length).to.equal(8);
  });

  it('should return correct urls for "tl" language code', () => {
    const result = getNonActiveLinkUrls('tl');

    result.forEach(url => {
      expect(/(tag)/i.test(url)).to.equal(false);
    });

    expect(result.length).to.equal(8);
  });
});
