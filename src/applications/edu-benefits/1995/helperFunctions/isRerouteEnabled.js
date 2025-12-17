import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const isRerouteEnabled = state => {
  if (state === undefined) return undefined;

  const flagFromStore = toggleValues(state)?.[
    FEATURE_FLAG_NAMES.meb1995Reroute
  ];
  if (typeof flagFromStore === 'boolean') {
    return flagFromStore;
  }
  return sessionStorage.getItem('meb1995Reroute') === 'true';
};
