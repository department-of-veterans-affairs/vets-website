import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { format } from 'date-fns';

export const APP_TYPES = Object.freeze({
  DEBT: 'DEBT',
  COPAY: 'COPAY',
});

export const ALERT_TYPES = Object.freeze({
  ZERO: 'ZERO',
  ERROR: 'ERROR',
});

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const formatDate = date => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};
