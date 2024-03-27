import moment from 'moment';

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
