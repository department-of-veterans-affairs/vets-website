import { expect } from 'chai';

const {
  setCookie,
  createTokenFromCookie,
  getFlipperId,
} = require('../../feature-toggles/helpers');

describe('feature toogles', () => {
  describe('setCookie', () => {
    it('should return the cookie if it already exists', () => {
      const token = 't68mzm0skza1zqwinl4byt';
      document.cookie = `newcookieName=${token}`;
      expect(setCookie('newcookieName', 'differentToken')).to.deep.equal(
        document.cookie.replace(
          // eslint-disable-next-line no-useless-escape
          /(?:(?:^|.*;\s*)newcookieName\s*\=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      );
    });

    it('should set a new cookie if one does not already exist', () => {
      const token = 't68mzm0skza1zqwinl4byt';
      expect(setCookie('cookieName', token)).to.deep.equal(token);
    });
  });

  describe('createTokenFromCookie', () => {
    it('should return the cookie if it already exists', () => {
      const token = 'g84k9d0skza1zqwinl4byt';
      document.cookie = `newcookieName=${token}`;
      expect(createTokenFromCookie('newcookieName')).to.deep.equal(
        document.cookie.replace(
          // eslint-disable-next-line no-useless-escape
          /(?:(?:^|.*;\s*)newcookieName\s*\=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      );
    });

    it('should return a random string if the cookie does not already exist', () => {
      expect(createTokenFromCookie('newcookieName')).to.not.deep.equal(
        document.cookie.replace(
          // eslint-disable-next-line no-useless-escape
          /(?:(?:^|.*;\s*)newcookieName\s*\=\s*([^;]*).*$)|^.*$/,
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
});
