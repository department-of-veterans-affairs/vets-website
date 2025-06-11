import { expect } from 'chai';

const {
  generateToken,
  getFlipperId,
} = require('../../feature-toggles/helpers');

describe('feature toggles', () => {
  let oldCookie;

  before(() => {
    oldCookie = document.cookie;
    document.cookie = '';
  });

  describe('generateToken', () => {
    it('should return a string', () => {
      const token = generateToken();
      expect(token).to.be.a('string');
      expect(token).to.not.be.empty;
    });
  });

  describe('getFlipperId', () => {
    it('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      expect(getFlipperId()).to.be.a('string').and.not.empty;
    });

    it('should set the FLIPPER_ID cookie to not be null', () => {
      document.cookie = '';
      expect(getFlipperId()).to.not.be.null;
    });

    it('should set the FLIPPER_ID cookie to not be empty', () => {
      document.cookie = '';
      expect(getFlipperId()).to.not.be.empty;
    });

    it('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      getFlipperId();
      const cookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      expect(cookie).to.be.a('string');
      expect(cookie).to.not.be.empty;
    });

    it('should not change an existing FLIPPER_ID', () => {
      document.cookie = 'FLIPPER_ID=something';
      getFlipperId();
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.be.equal('something');
    });
  });

  // Restore previous cookie set

  after(() => {
    document.cookie = oldCookie;
  });
});
