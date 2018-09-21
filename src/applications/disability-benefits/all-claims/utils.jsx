import React from 'react';
import moment from 'moment';
import Raven from 'raven-js';
import appendQuery from 'append-query';
import { apiRequest } from '../../../platform/utilities/api';
import _ from '../../../platform/utilities/data';


import {
  RESERVE_GUARD_TYPES,
  USA } from './constants';
/**
 * Show one thing, have a screen reader say another.
 * NOTE: This will cause React to get angry if used in a <p> because the DOM is "invalid."
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => {
  return (
    <div style={{ display: 'inline' }}>
      <span aria-hidden>{srIgnored}</span>
      <span className="sr-only">{substitutionText}</span>
    </div>
  );
};

export const hasGuardOrReservePeriod = (formData) => {
  const serviceHistory = formData.servicePeriods;
  if (!serviceHistory || !Array.isArray(serviceHistory)) {
    return false;
  }

  return serviceHistory.reduce((isGuardReserve, { serviceBranch }) => {
    // For a new service period, service branch defaults to undefined
    if (!serviceBranch) {
      return false;
    }
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return isGuardReserve
        || serviceBranch.includes(reserve)
        || serviceBranch.includes(nationalGuard);
  }, false);
};

export const ReservesGuardDescription = ({ formData }) => {
  const { servicePeriods } = formData;
  if (!servicePeriods || !Array.isArray(servicePeriods) || !servicePeriods[0].serviceBranch) {
    return null;
  }

  const mostRecentPeriod = servicePeriods.filter(({ serviceBranch }) => {
    const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
    return (serviceBranch.includes(nationalGuard) || serviceBranch.includes(reserve));
  }).map(({ serviceBranch, dateRange }) => {
    const dateTo = new Date(dateRange.to);
    return {
      serviceBranch,
      to: dateTo
    };
  }).sort((periodA, periodB) => (periodB.to - periodA.to))[0];

  if (!mostRecentPeriod) {
    return null;
  }
  const { serviceBranch, to } = mostRecentPeriod;
  return (
    <div>
      Please tell us more about your {serviceBranch} service that ended on {moment(to).format('MMMM DD, YYYY')}.
    </div>
  );
};

export const title10DatesRequired = (formData) => (
  _.get(
    'serviceInformation.reservesNationalGuardService.view:isTitle10Activated',
    formData,
    false)
);

export const isInFuture = (errors, fieldData) => {
  const enteredDate = new Date(fieldData);
  if (enteredDate < Date.now()) {
    errors.addError('Expected separation date must be in the future');
  }
};

const capitalizeEach = (word) => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

/**
 * Takes a string and returns the same string with every word capitalized. If no valid
 * string is given as input, returns 'Unknown Condition' and logs to Sentry.
 * @param {string} name the lower-case name of a disability
 * @returns {string} the input name, but with all words capitalized
 */
export const getDisabilityName = (name) => {
  if (name && typeof name === 'string') {
    return name.split(/ +/).map(capitalizeEach).join(' ');
  }

  Raven.captureMessage('form_526: no name supplied for ratedDisability');
  return 'Unknown Condition';
};

export function transformDisabilities(disabilities = []) {
  return disabilities
    // We want to remove disabilities without a rating, but 0 counts as a valid rating
    // TODO: Log the disabilities if they're not service connected
    // Unfortunately, we don't have decisionCode in the schema, so it's stripped out by the time
    //  it gets here and we can't tell whether it is service connected or not. This happens in
    //  the api
    .filter(disability => {
      if (disability.ratingPercentage || disability.ratingPercentage === 0) {
        return true;
      }

      // TODO: Only log it if the decision code indicates the condition is not non-service-connected
      const { decisionCode } = disability;
      if (decisionCode) {
        Raven.captureMessage('526_increase_disability_filter', {
          extra: { decisionCode }
        });
      }

      return false;
    }).map(disability => _.set('disabilityActionType', 'INCREASE', disability));
}

export function prefillTransformer(pages, formData, metadata) {
  const { disabilities } = formData;
  if (!disabilities || !Array.isArray(disabilities)) {
    Raven.captureMessage('vets-disability-increase-no-rated-disabilities-found');
    return { metadata, formData, pages };
  }
  const newFormData = _.set('ratedDisabilities', transformDisabilities(disabilities), formData);
  delete newFormData.disabilities;

  return {
    metadata,
    formData: newFormData,
    pages
  };
}

export const hasForwardingAddress = (formData) => (_.get('view:hasForwardingAddress', formData, false));

export const forwardingCountryIsUSA = (formData) => (_.get('forwardingAddress.country', formData, '') === USA);

export function fetchPaymentInformation() {
  return apiRequest('/ppiu/payment_information',
    {},
    response => {
      // Return only the bit the UI cares about
      return response.data.attributes.responses[0].paymentAccount;
    },
    () => {
      Raven.captureMessage('vets_payment_information_fetch_failure');
      return Promise.reject();
    }
  );
}

export function queryForFacilities(input = '') {
  // Only search if the input has a length >= 3, otherwise, return an empty array
  if (input.length < 3) {
    return Promise.resolve([]);
  }

  const url = appendQuery('/facilities/suggested', {
    type: ['health', 'dod_health'],
    name_part: input // eslint-disable-line camelcase
  });

  return apiRequest(url, {},
    (response) => {
      return response.data.map(facility => ({ id: facility.id, label: facility.attributes.name }));
    },
    (error) => {
      Raven.captureMessage('Error querying for facilities', { input, error });
      return [];
    }
  );
}