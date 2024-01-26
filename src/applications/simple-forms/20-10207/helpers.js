import React from 'react';

import { PREPARER_TYPES } from './config/constants';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getPreparerString(preparerType) {
  switch (preparerType) {
    case PREPARER_TYPES.THIRD_PARTY_VETERAN:
      return 'Veteran’s';
    case PREPARER_TYPES.THIRD_PARTY_NON_VETERAN:
      return 'Claimant’s';
    default:
      return 'Your';
  }
}

export function getPersonalInformationChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return `${preparerString} personal information`;
}

export function getNameAndDobPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return (
    <h3 className="vads-u-margin-y--0">
      {preparerString} name and date of birth
    </h3>
  );
}

export function getIdentityInfoPageTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);

  return (
    <h3 className="vads-u-margin-y--0">
      {preparerString} identification information
    </h3>
  );
}

export function getLivingSituationChapterTitle(formData) {
  const preparerString = getPreparerString(formData.preparerType);
  return `${preparerString} living situation`;
}

export function validateLivingSituation(errors, fields) {
  // eslint-disable-next-line no-console
  console.log(
    'helpers.validateLivingSituation] errors & fields params: ',
    errors,
    fields,
  );
  const selectedSituations = Object.keys(fields.livingSituation).filter(
    key => fields[key] === true,
  );

  if (selectedSituations.length === 0) {
    errors.livingSituation.addError('Select the appropriate living situation');
  }

  if (selectedSituations.length > 1 && selectedSituations.includes('NONE')) {
    errors.livingSituation.addError(
      'If none of these situations apply, unselect the other options you selected.',
    );
  }
}
