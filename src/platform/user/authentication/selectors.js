import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const ssoe = state => toggleValues(state).ssoe;
