/* eslint-disable camelcase */
import React from 'react';

import merge from 'lodash/fp/merge';

import environment from '../../common/helpers/environment';
import { formatDateLong } from '../../common/utils/helpers';

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

  return number.replace(number.substring(0, lengthOfXString), `${'x'.repeat(lengthOfXString)}-`);
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

export const enrollmentHistoryExplanation = {
  standard: (
    <div className="feature">
      <h4>Does something look wrong in your enrollment history?</h4>
      <span>Certain enrollments may not be displayed in this history if:</span>
      <ul>
        <li>Your school made a request to us that's still in process, <strong>or</strong></li>
        <li>You made a request to us that's still in process, <strong>or</strong></li>
        <li>You used or are using your benefit for flight, on-the-job, apprenticeship, or correspondence training</li>
      </ul>
    </div>
  ),
  noEnrollmentHistory: (
    <div className="feature">
      <h4>You don't have any enrollment history</h4>
      <span>Your enrollment history may not be available if:</span>
      <ul>
        <li>You or your school did not yet make a request to us, <strong>or</strong></li>
        <li>You or your school made a request that's still in process</li>
      </ul>
    </div>
  )
};

export function benefitEndDateExplanation(condition, delimitingDate) {
  switch (condition) {
    case 'activeDuty':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit End Date</h4>
          <div>
            Since you are currently on active duty, your benefits don't yet have an expiration date.
          </div>
        </div>
      );
    case 'remainingEntitlement':
      return (
        <div className="section benefit-end-date">
          <h4>Benefit End Date</h4>
          <div>
            You have until <strong>{formatDateLong(delimitingDate)}</strong> to use these benefits.
          </div>
        </div>
      );
    default:
      return undefined;
  }
}

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function apiRequest(url, optionalSettings = {}, success, error) {
  const requestUrl = `${environment.API_URL}${url}`;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel',
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(requestUrl, settings)
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
