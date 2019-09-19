import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const profileShowDirectDeposit = state =>
  toggleValues(state).profileShowDirectDeposit;
