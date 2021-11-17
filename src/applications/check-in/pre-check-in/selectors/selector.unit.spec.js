import { expect } from 'chai';

import { makeSelectFeatureToggles, makeSelectForm } from './index';

describe('check-in', () => {
  describe('selector', () => {
    describe('makeSelectFeatureToggles', () => {
      const state = {
        featureToggles: {
          loading: false,
          /* eslint-disable camelcase */
          check_in_experience_pre_check_in_enabled: true,
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles({});
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isPreCheckInEnabled: true,
        });
      });
    });
    describe('makeSelectForm', () => {
      const state = {
        preCheckInData: {
          form: {
            pages: [],
            currentPage: '',
          },
        },
      };
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectForm();
        expect(selectFeatureToggles(state)).to.eql({
          pages: [],
          currentPage: '',
        });
      });
    });
  });
});
