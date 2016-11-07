import moment from 'moment';
import { glossary } from '../config';

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

export function getModalTerm(term) {
  const allTerms = glossary.Prescription.concat(glossary.Refill);
  const content = allTerms.filter((obj) => {
    return obj.term === term;
  });
  return content;
}
