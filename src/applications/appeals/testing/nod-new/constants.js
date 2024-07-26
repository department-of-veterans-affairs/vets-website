import { isValid } from 'date-fns';

import {
  FORMAT_READABLE_DATE_FNS,
  FORMAT_YMD_DATE_FNS,
} from '../../shared/constants';
import { parseDate, parseDateToDateObj } from '../../shared/utils/dates';

export const BASE_URL = '/decision-reviews/testing/nod-new';

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
    const date = parseDateToDateObj(
      data.attributes?.approxDecisionDate || null,
      FORMAT_YMD_DATE_FNS,
    );
    return `Currently ${
      isValid(date) && granted
        ? parseDate(date, FORMAT_READABLE_DATE_FNS)
        : 'N/A'
    }`;
  },
  evaluation: data => {
    const percent = data.attributes?.ratingIssuePercentNumber;
    return `Currently ${percent ? `at ${percent}%` : 'N/A'}`;
  },
};
