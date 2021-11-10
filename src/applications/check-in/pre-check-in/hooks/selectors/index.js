import { createSelector } from 'reselect';

import { loadingFeatureFlags } from './selectors';

const selectFeatureToggles = createSelector(
  state => ({
    isLoadingFeatureFlags: loadingFeatureFlags(state),
  }),
  toggles => toggles,
);

const makeSelectFeatureToggles = () => selectFeatureToggles;

export { makeSelectFeatureToggles };
