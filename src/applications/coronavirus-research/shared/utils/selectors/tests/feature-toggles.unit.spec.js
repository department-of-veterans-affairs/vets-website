import { expect } from 'chai';

import { makeSelectFeatureToggles } from '../feature-toggles';

describe('covid-vaccine-trials-feature-toggles', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        covidVolunteerIntakeEnabled: true,
        covidVolunteerUpdateEnabled: true,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          covidVolunteerIntakeEnabled: true,
          covidVolunteerUpdateEnabled: true,
        });
      });
    });
  });
});
