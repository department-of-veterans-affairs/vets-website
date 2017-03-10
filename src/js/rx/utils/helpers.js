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

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}/v0/prescriptions`;
  const url = resource[0] === '/'
            ? [baseUrl, resource].join('')
            : resource;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel'
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(url, settings)
    .then((response) => {
      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) { return window.location.reload(); }
        return Promise.reject(response);
      } else if (isJson(response)) {
        return response.json();
      }
      return Promise.resolve(response);
    })
    .then(success, error);
}
