import moment from 'moment';

export function formatDate(date, options = {}) {
  const momentDate = moment(date);

  const isValidDate =
    momentDate.isValid() &&
    (!options.validateInPast ||
    momentDate.isSameOrBefore(moment().endOf('day')));

  return isValidDate
         ? momentDate.format(options.format || 'MMM DD, YYYY')
         : 'Not available';
}
