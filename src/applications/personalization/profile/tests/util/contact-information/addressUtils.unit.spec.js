import { expect } from 'chai';

import * as addressUtils from '@@profile/util/contact-information/addressUtils';

describe('Profile utils', () => {
  describe('contact-information utils', () => {
    describe('formatAddressTitle', () => {
      it('should format string to not include the word "address"', () => {
        const initial = 'Mailing address';

        const expected = 'Mailing';

        expect(addressUtils.formatAddressTitle(initial)).to.equal(expected);
      });
    });
  });
});
