const {
  generateToken,
  getFlipperId,
} = require('../../feature-toggles/helpers');

describe('feature toggles', () => {
  let oldCookie;

  beforeAll(() => {
    oldCookie = document.cookie;
    document.cookie = '';
  });

  describe('generateToken', () => {
    test('should return a string', () => {
      const token = generateToken();
      expect(typeof token).toBe('string');
      expect(Object.keys(token)).not.toHaveLength(0);
    });
  });

  describe('getFlipperId', () => {
    test('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      expect(typeof getFlipperId()).toBe('string').and.not.empty;
    });

    test('should set the FLIPPER_ID cookie to not be null', () => {
      document.cookie = '';
      expect(getFlipperId()).not.toBeNull();
    });

    test('should set the FLIPPER_ID cookie to not be empty', () => {
      document.cookie = '';
      expect(getFlipperId()).not.toHaveLength(0);
    });

    test('should set the FLIPPER_ID cookie to a non-empty string', () => {
      document.cookie = '';
      getFlipperId();
      const cookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)FLIPPER_ID=\s*([^;]*).*$)|^.*$/,
        '$1',
      );
      expect(typeof cookie).toBe('string');
      expect(Object.keys(cookie)).not.toHaveLength(0);
    });

    test('should not change an existing FLIPPER_ID', () => {
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

  afterAll(() => {
    document.cookie = oldCookie;
  });
});
