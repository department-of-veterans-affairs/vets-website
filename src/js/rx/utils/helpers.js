import merge from 'lodash/fp/merge';
import moment from 'moment';

import environment from '../../common/helpers/environment';
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

export function apiRequest(resource, optionalSettings = {}) {
  const baseUrl = `${environment.API_URL}/v0/prescriptions`;
  const url = [baseUrl, resource].join('');

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel'
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(url, settings);
}
