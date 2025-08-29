import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';

export const isLoadingFeatures = state => toggleValues(state).loading;
