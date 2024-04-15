// breaks unit tests if we use the workspace import
// eslint-disable-next-line @department-of-veterans-affairs/use-workspace-imports
import { selectDrupalStaticData } from 'platform/site-wide/drupal-static-data/selectors';

export const selectVamcSystemData = state =>
  selectDrupalStaticData(state)?.vamcSystemData?.data.systems || {};

// Returns an array of [vhaId, facilityName] tuples
export const selectFacilitiesForSystem = (state, systemName) =>
  Object.entries(selectVamcSystemData(state)?.[systemName] || {}) || [];
