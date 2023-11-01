import moment from 'moment';

import { FORMAT_READABLE } from '../shared/constants';

export const BASE_URL = '/decision-reviews/appeals-testing';

export const DISAGREEMENT_DEFAULTS = {
  disagreementOptions: {
    serviceConnection: false,
    effectiveDate: false,
    evaluation: false,
  },
  otherEntry: '',
};

/* testing only */
export const DISAGREEMENT_DETAILS = {
  serviceConnection: data => {
    const description = data.attributes?.description || '';
    if (!description) {
      return 'Unknown service connection';
    }
    return `Currently ${
      description.includes('Service connection for') &&
      description.includes('is granted')
        ? ''
        : 'not '
    }service connected`;
  },
  effectiveDate: data => {
    const description = data.attributes?.description || '';
    const granted =
      description.includes('Service connection for') &&
      description.includes('is granted');
    const date = moment(data.attributes?.approxDecisionDate || null);
    return `Currently ${
      date.isValid() && granted ? date.format(FORMAT_READABLE) : 'N/A'
    }`;
  },
  evaluation: data => {
    const percent = data.attributes?.ratingIssuePercentNumber;
    return `Currently ${percent ? `at ${percent}%` : 'N/A'}`;
  },
};
