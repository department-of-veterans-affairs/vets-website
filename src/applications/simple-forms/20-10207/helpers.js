import React from 'react';

import { PREPARER_TYPES } from './config/constants';

export function getMockData(mockData, isLocalhost) {
  return !!mockData && isLocalhost() && !window.Cypress ? mockData : undefined;
}

export function getTitlePrefix(preparerType) {
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
  const prefix = getTitlePrefix(formData.preparerType);

  return `${prefix} personal information`;
}

export function getNameAndDobPageTitle(formData) {
  const prefix = getTitlePrefix(formData.preparerType);

  return (
    <h3 className="vads-u-margin-y--0">{prefix} name and date of birth</h3>
  );
}

export function getIdentityPageTitle(formData) {
  const prefix = getTitlePrefix(formData.preparerType);

  return (
    <h3 className="vads-u-margin-y--0">{prefix} identification information</h3>
  );
}
