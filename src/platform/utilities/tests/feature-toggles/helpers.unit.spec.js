import { expect } from 'chai';

const {
  createTokenFromCookie,
  getFlipperId,
} = require('../../feature-toggles/helpers');

describe('feature toogles', () => {
  let oldCookie;

  before(() => {
    oldCookie = document.cookie;
    document.cookie = '';
  });

  describe('createTokenFromCookie', () => {
    it('should return the cookie if it already exists', () => {
      const token = 'g84k9d0skza1zqwinl4byt';
      document.cookie = `GACookie=${token}`;
      expect(createTokenFromCookie('GACookie')).to.equal(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)GACookie=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      );
    });

    it('should return a random string if the cookie does not already exist', () => {
      document.cookie = '';
      expect(createTokenFromCookie('GACookie')).to.not.equal(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)GACookie=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      );
    });
  });

  describe('getFlipperId', () => {
    const FLIPPER_ID = getFlipperId();

    it('should be a string', () => {
      expect(FLIPPER_ID).to.be.a('string');
    });

    it('should not be null', () => {
      expect(FLIPPER_ID).to.not.be.null;
    });

    it('should not be empty', () => {
      expect(FLIPPER_ID).to.not.be.empty;
    });
  });

  // Restore previous cookie set

  before(() => {
    document.cookie = oldCookie;
  });
});
