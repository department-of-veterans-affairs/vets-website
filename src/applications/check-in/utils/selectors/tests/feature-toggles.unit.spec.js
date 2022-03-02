import { expect } from 'chai';

import { makeSelectFeatureToggles } from '../feature-toggles';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        check_in_experience_enabled: true,
        check_in_experience_pre_check_in_enabled: true,
        check_in_experience_demographics_page_enabled: true,
        check_in_experience_update_information_page_enabled: true,
        check_in_experience_next_of_kin_enabled: false,
        check_in_experience_editing_day_of_enabled: false,
        check_in_experience_editing_pre_check_in_enabled: false,
        check_in_experience_day_of_demographics_flags_enabled: false,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isCheckInEnabled: true,
          isPreCheckInEnabled: true,
          isUpdatePageEnabled: true,
          isEditingPreCheckInEnabled: false,
          isEditingDayOfEnabled: false,
          isDayOfDemographicsFlagsEnabled: false,
        });
      });
    });
  });
});
