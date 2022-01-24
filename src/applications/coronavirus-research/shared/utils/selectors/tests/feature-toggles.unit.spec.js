import { expect } from 'chai';

import { makeSelectFeatureToggles } from '../feature-toggles';

describe('covid-vaccine-trials-feature-toggles', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        covid_volunteer_intake_enabled: true,
        covid_volunteer_update_enabled: true,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isCovidVaccineTrialsIntakeEnabled: true,
          isCovidVaccineTrialsUpdateEnabled: true,
        });
      });
    });
  });
});
