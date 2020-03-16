import { expect } from 'chai';

const { getFlipperId } = require('../../feature-toggles/helpers');

describe('feature-toogles', () => {
  describe('Create a cookie', () => {});

  describe('Generate unique ID', () => {
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
