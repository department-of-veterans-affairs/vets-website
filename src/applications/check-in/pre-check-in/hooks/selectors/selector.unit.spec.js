import { expect } from 'chai';

import { makeSelectFeatureToggles } from './index';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        pre_check_in_experience_enabled: true,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isPreCheckInEnabled: true,
          isLoadingFeatureFlags: false,
        });
      });
    });
  });
});
