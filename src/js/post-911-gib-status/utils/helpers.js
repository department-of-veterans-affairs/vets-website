import merge from 'lodash/fp/merge';

import { isJson } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';

export function formatPercent(percent) {
  let validPercent = undefined;

  if (!isNaN(parseInt(percent, 10))) {
    validPercent = `${Math.round(percent)}%`;
  }

  return validPercent;
}

export function formatVAFileNumber(n) {
  const number = n || '';
  const lengthOfXString = number.length > 4 ? number.length - 4 : 0;

  return number.replace(number.substring(0, lengthOfXString),
                        `${'x'.repeat(lengthOfXString)}-`);
}

export function formatMonthDayFields(field) {
  let displayValue;
  if (field) {
    displayValue = `${field.months} months, ${field.days} days`;
  } else {
    displayValue = 'unavailable';
  }
  return displayValue;
}

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}/v0`;
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
      const data = isJson(response)
                 ? response.json()
                 : Promise.resolve(response);
      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) { return window.location.reload(); }
        return Promise.reject(response);
      }
      return data;
    })
    .then(success, error);
}
