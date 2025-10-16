import { expect } from 'chai';
import { isLoadingFeatures } from '../../selectors';

describe('letters feature toggle selectors', () => {
  const getState = (overrides = {}) => ({
    featureToggles: {
      loading: false,
      ...overrides,
    },
  });

  describe('isLoadingFeatures', () => {
    it('returns true when loading is true', () => {
      const state = getState({ loading: true });
      expect(isLoadingFeatures(state)).to.be.true;
    });

    it('returns false when loading is false', () => {
      const state = getState({ loading: false });
      expect(isLoadingFeatures(state)).to.be.false;
    });
  });
});
