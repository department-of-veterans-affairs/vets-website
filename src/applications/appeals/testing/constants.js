import moment from 'moment';

import { FORMAT_READABLE } from '../shared/constants';
import { getIssueDate } from '../shared/utils/issues';

export const BASE_URL = '/decision-reviews/appeals-testing';

/* testing only */
export const DISAGREEMENT_DETAILS = {
  serviceConnection: data => {
    const description = data.attributes?.description || '';
    if (!description) {
      return 'Unknown service connection';
    }
    return `Currently ${
      description.includes('Service connection for') ? '' : 'not '
    }service connected`;
  },
  effectiveDate: data => {
    const date = getIssueDate(data);
    return `Current ${moment(date).format(FORMAT_READABLE)}`;
  },
  evaluation: data =>
    data.attributes
      ? `Currently at ${data.attributes.ratingIssuePercentNumber}%`
      : '',
};
