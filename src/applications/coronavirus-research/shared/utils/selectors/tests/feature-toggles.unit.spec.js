import { expect } from 'chai';

import { makeSelectFeatureToggles } from '../feature-toggles';

describe('covid-vaccine-trials-feature-toggles', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        covid_vaccine_registration: true,
        check_in_experience_pre_check_in_enabled: true,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isCovidVaccineTrialsIntakeEnabled: true,
          isPreCheckInEnabled: true,
        });
      });
    });
  });
});
