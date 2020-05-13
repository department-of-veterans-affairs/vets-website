import React from 'react';
import { Link } from 'react-router';
import environment from 'platform/utilities/environment';

import {
  capitalizeEachWord,
  isDisabilityPtsd,
  DISABILITY_SHARED_CONFIG,
} from '../utils';
import { ptsdTypeEnum } from './ptsdTypeInfo';
import { NULL_CONDITION_STRING } from '../constants';

const mapDisabilityName = (disabilityName, formData, index) => {
  if (isDisabilityPtsd(disabilityName)) {
    const selectablePtsdTypes = formData['view:selectablePtsdTypes'];
    if (selectablePtsdTypes) {
      const selectedPtsdTypes = Object.keys(selectablePtsdTypes)
        .filter(ptsdType => selectablePtsdTypes[ptsdType])
        .map((ptsdType, i) => {
          const ptsdTypeEnumKey = ptsdType.replace('view:', '');
          const ptsdTypeTitle = ptsdTypeEnum[ptsdTypeEnumKey];
          return <li key={`"${ptsdTypeEnumKey}-${i}"`}>{ptsdTypeTitle}</li>;
        });
      return (
        <li key={`"${disabilityName}-${index}"`}>
          {disabilityName}
          <ul>{selectedPtsdTypes}</ul>
        </li>
      );
    }
  }
  return <li key={`"${disabilityName}-${index}"`}>{disabilityName}</li>;
};

const getRedirectLink = formData => {
  if (environment.isProduction()) {
    return 'go back to the beginning of this step and add it';
  }
  // Start from orientation page; assuming user has both existing & new
  // disabilities selected
  let destinationPath = DISABILITY_SHARED_CONFIG.orientation.path;

  if (DISABILITY_SHARED_CONFIG.ratedDisabilities.depends(formData)) {
    // start from rated disabilities page
    destinationPath = DISABILITY_SHARED_CONFIG.ratedDisabilities.path;
  } else if (DISABILITY_SHARED_CONFIG.addDisabilities.depends(formData)) {
    destinationPath = DISABILITY_SHARED_CONFIG.addDisabilities.path;
  }
  return (
    <Link
      aria-label="go back and add it, any missing disabilities"
      to={{
        pathname: destinationPath || '/',
        search: '?redirect',
      }}
    >
      go back and add it
    </Link>
  );
};

export const SummaryOfDisabilitiesDescription = ({ formData }) => {
  const { ratedDisabilities, newDisabilities } = formData;
  const ratedDisabilityNames = ratedDisabilities
    ? ratedDisabilities
        .filter(disability => disability['view:selected'])
        .map(
          disability =>
            typeof disability.name === 'string'
              ? capitalizeEachWord(disability.name)
              : NULL_CONDITION_STRING,
        )
    : [];
  const newDisabilityNames =
    newDisabilities && formData['view:newDisabilities']
      ? newDisabilities.map(
          disability =>
            typeof disability.condition === 'string'
              ? capitalizeEachWord(disability.condition)
              : NULL_CONDITION_STRING,
        )
      : [];
  const selectedDisabilitiesList = ratedDisabilityNames
    .concat(newDisabilityNames)
    .map((name, i) => mapDisabilityName(name, formData, i));

  const showLink = getRedirectLink(formData);

  return (
    <>
      <p>
        Below is the list of disabilities you’re claiming in this application.
        If a disability is missing from the list, please {showLink}.
      </p>
      <ul>{selectedDisabilitiesList}</ul>
    </>
  );
};
