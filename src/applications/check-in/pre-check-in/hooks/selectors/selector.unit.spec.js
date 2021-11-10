import { expect } from 'chai';

import { makeSelectFeatureToggles } from './index';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
        });
      });
    });
  });
});
