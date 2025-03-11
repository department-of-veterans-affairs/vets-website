import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';

// Feature toggles
export const isLoadingFeatures = state => toggleValues(state).loading;
