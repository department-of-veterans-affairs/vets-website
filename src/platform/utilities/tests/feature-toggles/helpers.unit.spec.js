import { expect } from 'chai';

const {
  generateToken,
  getFlipperId,
} = require('../../feature-toggles/helpers');

describe('feature toogles', () => {
  let oldCookie;

  before(() => {
    oldCookie = document.cookie;
    document.cookie = '';
  });

  describe('generateToken', () => {
    it('should return a string', () => {
      document.cookie = '';
      expect(generateToken()).to.be.a('string');
    });

    it('should return a not-null value', () => {
      document.cookie = '';
      expect(generateToken()).to.not.be.null;
    });

    it('should return a not-empty value', () => {
      document.cookie = '';
      expect(generateToken()).to.not.be.empty;
    });
  });

  describe('getFlipperId', () => {
    it('should set the FLIPPER_ID cookie to a string', () => {
      document.cookie = '';
      expect(getFlipperId()).to.be.a('string');
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
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.be.a('string');
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.not.be.null;
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.not.be.empty;
    });

    it('should not change an existing FLIPPER_ID', () => {
      document.cookie = '';
      expect(getFlipperId()).to.be.equal(getFlipperId());
    });
  });

  // Restore previous cookie set

  after(() => {
    document.cookie = oldCookie;
  });
});
