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
      const token = createTokenFromCookie('GACookie');
      expect(token).to.be.a('string');
      expect(token.length > 0).to.be.true;
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

    it('should be a string from the FLIPPER_ID', () => {
      getFlipperId();
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.be.a('string');
    });

    it('should not be null from the FLIPPER_ID', () => {
      getFlipperId();
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.not.be.null;
    });

    it('should not be empty from the FLIPPER_ID', () => {
      getFlipperId();
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).to.not.be.empty;
    });
  });

  // Restore previous cookie set

  after(() => {
    document.cookie = oldCookie;
  });
});
