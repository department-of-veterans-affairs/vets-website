import { expect } from 'chai';
import { getNonActiveLinkUrls } from '../utilities/helpers';

describe('getNonActiveLinkUrls util', () => {
  it('should return non-english urls for "en" language code', () => {
    const result = getNonActiveLinkUrls('en');

    expect(result.length).to.equal(8);
  });
});
