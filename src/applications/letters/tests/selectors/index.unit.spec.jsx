import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { expect } from 'chai';
import {
  isLoadingFeatures,
  lettersUseLighthouse,
  lettersCheckDiscrepancies,
  lettersPageNewDesign,
  togglesAreLoaded,
} from '../../selectors';

describe('letters feature toggle selectors', () => {
  const getState = (overrides = {}) => ({
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.bcasLettersUseLighthouse]: true,
      [FEATURE_FLAG_NAMES.lettersCheckDiscrepancies]: false,
      [FEATURE_FLAG_NAMES.lettersPageNewDesign]: true,
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

  describe('lettersUseLighthouse', () => {
    it('returns true when flag is enabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.bcasLettersUseLighthouse]: true,
      });
      expect(lettersUseLighthouse(state)).to.be.true;
    });

    it('returns false when flag is disabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.bcasLettersUseLighthouse]: false,
      });
      expect(lettersUseLighthouse(state)).to.be.false;
    });
  });

  describe('lettersCheckDiscrepancies', () => {
    it('returns true when flag is enabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.lettersCheckDiscrepancies]: true,
      });
      expect(lettersCheckDiscrepancies(state)).to.be.true;
    });

    it('returns false when flag is disabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.lettersCheckDiscrepancies]: false,
      });
      expect(lettersCheckDiscrepancies(state)).to.be.false;
    });
  });

  describe('lettersPageNewDesign', () => {
    it('returns true when flag is enabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.lettersPageNewDesign]: true,
      });
      expect(lettersPageNewDesign(state)).to.be.true;
    });

    it('returns false when flag is disabled', () => {
      const state = getState({
        [FEATURE_FLAG_NAMES.lettersPageNewDesign]: false,
      });
      expect(lettersPageNewDesign(state)).to.be.false;
    });
  });

  describe('togglesAreLoaded', () => {
    it('returns true when loading is false', () => {
      const state = getState({ loading: false });
      expect(togglesAreLoaded(state)).to.be.true;
    });

    it('returns false when loading is true', () => {
      const state = getState({ loading: true });
      expect(togglesAreLoaded(state)).to.be.false;
    });
  });
});
