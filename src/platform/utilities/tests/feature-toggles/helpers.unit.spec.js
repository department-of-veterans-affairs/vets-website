import { expect } from 'chai';

const {
  createTokenFromCookie,
  setCookie,
} = require('../../feature-toggles/helpers');

describe('feature-toogles', () => {
  describe('Generate unique ID', () => {
    const FLIPPER_ID = setCookie(
      'FLIPPER_ID',
      createTokenFromCookie('_vagovRollup_gid'),
    );

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
