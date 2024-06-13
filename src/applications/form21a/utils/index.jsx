import moment from 'moment';
import { isValidYear } from 'platform/forms-system/src/js/utilities/validations';

import { getBranches } from './serviceBranches';
import { DATE_FORMAT } from '../constants';

export const formatDate = (date, format = DATE_FORMAT) => {
  const m = moment(date);
  return date && m.isValid() ? m.format(format) : 'Unknown';
};

export const formatDateRange = (dateRange = {}, format = DATE_FORMAT) =>
  dateRange?.from || dateRange?.to
    ? `${formatDate(dateRange.from, format)} to ${formatDate(
        dateRange.to,
        format,
      )}`
    : 'Unknown';

export const isUndefined = value => (value || '') === '';

export const isValidFullDate = dateString => {
  // expecting dateString = 'YYYY-MM-DD'
  const date = moment(dateString);
  return (
    (date?.isValid() &&
      // moment('2021') => '2021-01-01'
      // moment('XXXX-01-01') => '2001-01-01'
      dateString === formatDate(date, 'YYYY-MM-DD') &&
      // make sure we're within the min & max year range
      isValidYear(date.year())) ||
    false
  );
};

export const isValidServicePeriod = data => {
  const { serviceBranch, dateRange: { from = '', to = '' } = {} } = data || {};
  return (
    (!isUndefined(serviceBranch) &&
      getBranches().includes(serviceBranch) &&
      !isUndefined(from) &&
      !isUndefined(to) &&
      isValidFullDate(from) &&
      isValidFullDate(to) &&
      moment(from).isBefore(moment(to))) ||
    false
  );
};
