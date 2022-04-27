import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import moment from 'moment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const combinedPortalAccess = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.combinedDebtPortalAccess];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;

export const formatDate = date => {
  return moment(date, 'MM-DD-YYYY').format('MMMM D, YYYY');
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  return formatter.format(parseFloat(amount));
};
