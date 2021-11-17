import { expect } from 'chai';

import { makeSelectFeatureToggles } from './index';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        loading: false,
        /* eslint-disable camelcase */
        check_in_experience_pre_check_in_enabled: true,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles({});
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isPreCheckInEnabled: true,
        });
      });
    });
  });
});
