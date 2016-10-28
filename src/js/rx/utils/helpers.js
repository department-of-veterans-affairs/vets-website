import moment from 'moment';

export function formatDate(date, options = {}) {
  const momentDate = moment(date);

  const isValidDate =
    momentDate.isValid() &&
    (!options.validateInFuture ||
    momentDate.isAfter(moment().startOf('day')));

  return isValidDate
         ? momentDate.format(options.format || 'MMM DD, YYYY')
         : 'Not available';
}
