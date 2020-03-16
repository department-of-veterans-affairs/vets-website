import { expect } from 'chai';

const FLIPPER_ID = require('../../feature-toggles/flipperID');

describe('feature-toogles', () => {
  describe('Generate unique ID', () => {
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
