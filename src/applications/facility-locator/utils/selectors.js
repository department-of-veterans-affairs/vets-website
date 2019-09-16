import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const facilityLocatorShowCommunityCares = state =>
  toggleValues(state).facilityLocatorShowCommunityCares;
