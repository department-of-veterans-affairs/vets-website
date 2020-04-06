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
      expect(typeof token).toBe('string');
      expect(Object.keys(token)).not.toHaveLength(0);
    });
  });

  describe('getFlipperId', () => {
    it('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      expect(typeof getFlipperId()).toBe('string').and.not.empty;
    });

    it('should set the FLIPPER_ID cookie to not be null', () => {
      document.cookie = '';
      expect(getFlipperId()).not.toBeNull();
    });

    it('should set the FLIPPER_ID cookie to not be empty', () => {
      document.cookie = '';
      expect(getFlipperId()).not.toHaveLength(0);
    });

    it('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      getFlipperId();
      const cookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      expect(typeof cookie).toBe('string');
      expect(Object.keys(cookie)).not.toHaveLength(0);
    });

    it('should not change an existing FLIPPER_ID', () => {
      document.cookie = 'FLIPPER_ID=something';
      getFlipperId();
      expect(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
          '$1',
        ),
      ).toBe('something');
    });
  });

  // Restore previous cookie set

  after(() => {
    document.cookie = oldCookie;
  });
});
