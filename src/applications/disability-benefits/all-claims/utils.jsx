import React from 'react';
import moment from 'moment';
import Raven from 'raven-js';
import appendQuery from 'append-query';
import { createSelector } from 'reselect';
import { transformForSubmit } from 'us-forms-system/lib/js/helpers';
import { apiRequest } from '../../../platform/utilities/api';
import _ from '../../../platform/utilities/data';
import removeDeeplyEmptyObjects from '../../../platform/utilities/data/removeDeeplyEmptyObjects';

import {
  RESERVE_GUARD_TYPES,
  SERVICE_CONNECTION_TYPES,
  USA,
  DATA_PATHS,
  NINE_ELEVEN,
  HOMELESSNESS_TYPES,
} from './constants';
/**
 * Show one thing, have a screen reader say another.
 *
 * @param {ReactElement|ReactComponent|String} srIgnored -- Thing to be displayed visually,
 *                                                           but ignored by screen readers
 * @param {String} substitutionText -- Text for screen readers to say instead of srIgnored
 */
export const srSubstitute = (srIgnored, substitutionText) => (
  <span>
    <span aria-hidden>{srIgnored}</span>
    <span className="sr-only">{substitutionText}</span>
  </span>
);

export const hasGuardOrReservePeriod = formData => {
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
    return (
      isGuardReserve ||
      serviceBranch.includes(reserve) ||
      serviceBranch.includes(nationalGuard)
    );
  }, false);
};

export const ReservesGuardDescription = ({ formData }) => {
  const { servicePeriods } = formData;
  if (
    !servicePeriods ||
    !Array.isArray(servicePeriods) ||
    !servicePeriods[0].serviceBranch
  ) {
    return null;
  }

  const mostRecentPeriod = servicePeriods
    .filter(({ serviceBranch }) => {
      const { nationalGuard, reserve } = RESERVE_GUARD_TYPES;
      return (
        serviceBranch.includes(nationalGuard) || serviceBranch.includes(reserve)
      );
    })
    .map(({ serviceBranch, dateRange }) => {
      const dateTo = new Date(dateRange.to);
      return {
        serviceBranch,
        to: dateTo,
      };
    })
    .sort((periodA, periodB) => periodB.to - periodA.to)[0];

  if (!mostRecentPeriod) {
    return null;
  }
  const { serviceBranch, to } = mostRecentPeriod;
  return (
    <div>
      Please tell us more about your {serviceBranch} service that ended on{' '}
      {moment(to).format('MMMM DD, YYYY')}.
    </div>
  );
};

export const title10DatesRequired = formData =>
  _.get(
    'serviceInformation.reservesNationalGuardService.view:isTitle10Activated',
    formData,
    false,
  );

export const isInFuture = (errors, fieldData) => {
  const enteredDate = new Date(fieldData);
  if (enteredDate < Date.now()) {
    errors.addError('Expected separation date must be in the future');
  }
};

const capitalizeEach = word => {
  const capFirstLetter = word[0].toUpperCase();
  return `${capFirstLetter}${word.slice(1)}`;
};

/**
 * Takes a string and returns the same string with every word capitalized. If no valid
 * string is given as input, returns 'Unknown Condition' and logs to Sentry.
 * @param {string} name the lower-case name of a disability
 * @returns {string} the input name, but with all words capitalized
 */
export const getDisabilityName = name => {
  if (name && typeof name === 'string') {
    return name
      .split(/ +/)
      .map(capitalizeEach)
      .join(' ');
  }

  Raven.captureMessage('form_526: no name supplied for ratedDisability');
  return 'Unknown Condition';
};

export function transformDisabilities(disabilities = []) {
  return (
    disabilities
      // We want to remove disabilities that aren't service-connected
      .filter(
        disability =>
          disability.decisionCode === SERVICE_CONNECTION_TYPES.serviceConnected,
      )
      .map(disability => _.set('disabilityActionType', 'INCREASE', disability))
  );
}

export function prefillTransformer(pages, formData, metadata) {
  const { disabilities } = formData;
  if (!disabilities || !Array.isArray(disabilities)) {
    Raven.captureMessage(
      'vets-disability-increase-no-rated-disabilities-found',
    );
    return { metadata, formData, pages };
  }
  const newFormData = _.set(
    'ratedDisabilities',
    transformDisabilities(disabilities),
    formData,
  );
  delete newFormData.disabilities;

  return {
    metadata,
    formData: newFormData,
    pages,
  };
}

/**
 * Transforms the related disabilities object into an array of strings. The condition
 *  name only gets added to the list if the property value is truthy and is in the list
 *  of conditions claimed on the application.
 *
 * @param {Object} object - The object with dynamically generated property names
 * @param {Array<String>} claimedConditions - An array of lower-cased names of conditions claimed
 * @return {Array} - An array of the property names with truthy values
 *                   NOTE: This will return all lower-cased names
 */
export function transformRelatedDisabilities(object, claimedConditions) {
  return Object.keys(object)
    .filter(
      // The property name will be normal-cased in the object, but lower-cased in claimedConditions
      key => object[key] && claimedConditions.includes(key.toLowerCase()),
    )
    .map(key => key.toLowerCase());
}

/**
 * Cycles through the list of provider facilities and performs transformations on each property as needed
 * @param {array} providerFacilities array of objects being transformed
 * @returns {array} containing the new Provider Facility structure
 */
export function transformProviderFacilities(providerFacilities) {
  return providerFacilities.map(facility => ({
    ...facility,
    treatmentDateRange: [facility.treatmentDateRange],
  }));
}

export function transform(formConfig, form) {
  // Remove rated disabilities that weren't selected
  let clonedData = _.set(
    'ratedDisabilities',
    form.data.ratedDisabilities.filter(condition => condition['view:selected']),
    form.data,
  );

  const claimedConditions = clonedData.ratedDisabilities
    ? clonedData.ratedDisabilities.map(d => d.name.toLowerCase())
    : [];
  if (clonedData.newDisabilities) {
    clonedData.newDisabilities.forEach(d =>
      claimedConditions.push(d.condition.toLowerCase()),
    );
  }

  // Have to do this first or it messes up the results from transformRelatedDisabilities for some reason.
  // The transformForSubmit's JSON.stringify transformer doesn't remove deeply empty objects, so we call
  //  it here to remove reservesNationalGuardService if it's deeply empty.
  clonedData = removeDeeplyEmptyObjects(
    JSON.parse(transformForSubmit(formConfig, form)),
  );

  // Transform the related disabilities lists into an array of strings
  if (clonedData.vaTreatmentFacilities) {
    const newVAFacilities = clonedData.vaTreatmentFacilities.map(facility =>
      _.set(
        'treatedDisabilityNames',
        transformRelatedDisabilities(
          facility.treatedDisabilityNames,
          claimedConditions,
        ),
        facility,
      ),
    );
    clonedData.vaTreatmentFacilities = newVAFacilities;
  }

  // Add POW specialIssue to new conditions
  if (clonedData.powDisabilities) {
    const powDisabilities = transformRelatedDisabilities(
      clonedData.powDisabilities,
      claimedConditions,
    ).map(name => name.toLowerCase());

    clonedData.newDisabilities = clonedData.newDisabilities.map(d => {
      if (powDisabilities.includes(d.condition.toLowerCase())) {
        const newSpecialIssues = (d.specialIssues || []).slice();
        // TODO: Make a constant with all the possibilities and use it here
        newSpecialIssues.push({ code: 'POW', name: '' });
        return _.set('specialIssues', newSpecialIssues, d);
      }
      return d;
    });
    delete clonedData.powDisabilities;
  }

  if (clonedData.providerFacility) {
    clonedData.form4142 = {
      ...(clonedData.limitedConsent && {
        limitedConsent: clonedData.limitedConsent,
      }),
      ...(clonedData.providerFacility && {
        providerFacility: transformProviderFacilities(
          clonedData.providerFacility,
        ),
      }),
    };

    delete clonedData.limitedConsent;
    delete clonedData.providerFacility;
  }

  return JSON.stringify({
    form526: JSON.stringify(clonedData),
  });
}

export const hasForwardingAddress = formData =>
  _.get('view:hasForwardingAddress', formData, false);

export const forwardingCountryIsUSA = formData =>
  _.get('forwardingAddress.country', formData, '') === USA;

export function queryForFacilities(input = '') {
  // Only search if the input has a length >= 3, otherwise, return an empty array
  if (input.length < 3) {
    return Promise.resolve([]);
  }

  const url = appendQuery('/facilities/suggested', {
    type: ['health', 'dod_health'],
    name_part: input, // eslint-disable-line camelcase
  });

  return apiRequest(
    url,
    {},
    response =>
      response.data.map(facility => ({
        id: facility.id,
        label: facility.attributes.name,
      })),
    error => {
      Raven.captureMessage('Error querying for facilities', { input, error });
      return [];
    },
  );
}

export const addCheckboxPerDisability = (form, pageSchema) => {
  const { ratedDisabilities, newDisabilities } = form;
  // This shouldn't happen, but could happen if someone directly
  // opens the right page in the form with no SiP
  if (!ratedDisabilities && !newDisabilities) {
    return pageSchema;
  }
  const selectedRatedDisabilities = Array.isArray(ratedDisabilities)
    ? ratedDisabilities.filter(disability => disability['view:selected'])
    : [];

  const selectedNewDisabilities = Array.isArray(newDisabilities)
    ? newDisabilities
    : [];

  // TODO: We might be able to clean this up once we know how EVSS
  // We expect to get an array with conditions in it or no property
  // at all.
  const disabilitiesViews = selectedRatedDisabilities
    .concat(selectedNewDisabilities)
    .reduce((accum, curr) => {
      const disabilityName = curr.name || curr.condition;
      const capitalizedDisabilityName = getDisabilityName(disabilityName);
      return _.set(capitalizedDisabilityName, { type: 'boolean' }, accum);
    }, {});
  return {
    properties: disabilitiesViews,
  };
};

const formattedNewDisabilitiesSelector = createSelector(
  formData => formData.newDisabilities,
  (newDisabilities = []) =>
    newDisabilities.map(disability => getDisabilityName(disability.condition)),
);

export const addCheckboxPerNewDisability = createSelector(
  formattedNewDisabilitiesSelector,
  newDisabilities => ({
    properties: newDisabilities.reduce(
      (accum, disability) => _.set(disability, { type: 'boolean' }, accum),
      {},
    ),
  }),
);

export const hasVAEvidence = formData =>
  _.get(DATA_PATHS.hasVAEvidence, formData, false);
export const hasOtherEvidence = formData =>
  _.get(DATA_PATHS.hasAdditionalDocuments, formData, false);
export const hasPrivateEvidence = formData =>
  _.get(DATA_PATHS.hasPrivateEvidence, formData, false);

/**
 * Inspects all given paths in the formData object for presence of values
 * @param {object} formData  full formData for the form
 * @param {array} fieldPaths full paths in formData for other fields that
 *                           should be checked for input
 * @returns {boolean} true if at least one path is not empty / false otherwise
 */
export const fieldsHaveInput = (formData, fieldPaths) =>
  fieldPaths.some(path => !!_.get(path, formData, ''));

export const bankFieldsHaveInput = formData =>
  fieldsHaveInput(formData, [
    'bankAccountType',
    'bankAccountNumber',
    'bankRoutingNumber',
    'bankName',
  ]);

const post911Periods = createSelector(
  data => _.get('serviceInformation.servicePeriods', data, []),
  periods =>
    periods.filter(({ dateRange }) => {
      if (!(dateRange && dateRange.to)) {
        return false;
      }

      const toDate = new Date(dateRange.to);
      const cutOff = new Date(NINE_ELEVEN);
      return toDate.getTime() > cutOff.getTime();
    }),
);

export const servedAfter911 = formData => !!post911Periods(formData).length;

export const needsToEnter781 = formData =>
  _.get('view:selectablePtsdTypes.view:combatPtsdType', formData, false) ||
  _.get('view:selectablePtsdTypes.view:noncombatPtsdType', formData, false);

export const needsToEnter781a = formData =>
  _.get('view:selectablePtsdTypes.view:mstPtsdType', formData, false) ||
  _.get('view:selectablePtsdTypes.view:assaultPtsdType', formData, false);

export const isUploading781Form = formData =>
  _.get('view:upload781Choice', formData, '') === 'upload';

export const isUploading781aForm = formData =>
  _.get('view:upload781aChoice', formData, '') === 'upload';

export const isAnswering781Questions = index => formData =>
  _.get('view:upload781Choice', formData, '') === 'answerQuestions' &&
  (index === 0 ||
    _.get(`view:enterAdditionalEvents${index - 1}`, formData, false)) &&
  needsToEnter781(formData);

export const isAnswering781aQuestions = index => formData =>
  _.get('view:upload781aChoice', formData, '') === 'answerQuestions' &&
  (index === 0 ||
    _.get(
      `view:enterAdditionalSecondaryEvents${index - 1}`,
      formData,
      false,
    )) &&
  needsToEnter781a(formData);

export const getHomelessOrAtRisk = formData => {
  const homelessStatus = _.get('homelessOrAtRisk', formData, '');
  return (
    homelessStatus === HOMELESSNESS_TYPES.homeless ||
    homelessStatus === HOMELESSNESS_TYPES.atRisk
  );
};

export const isNotUploadingPrivateMedical = formData =>
  _.get(DATA_PATHS.hasPrivateRecordsToUpload, formData) === false;

export const showPtsdCombatConclusion = form =>
  form['view:uploadPtsdChoice'] === 'answerQuestions' &&
  (_.get('view:selectablePtsdTypes.view:combatPtsdType', form, false) ||
    _.get('view:selectablePtsdTypes.view:noncombatPtsdType', form, false));

export const showPtsdAssaultConclusion = form =>
  form['view:uploadPtsdChoice'] === 'answerQuestions' &&
  (_.get('view:selectablePtsdTypes.view:mstPtsdType', form, false) ||
    _.get('view:selectablePtsdTypes.view:assaultPtsdType', form, false));
