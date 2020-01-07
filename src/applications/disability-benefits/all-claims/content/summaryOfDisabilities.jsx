import React from 'react';
import { Link } from 'react-router';

import { capitalizeEachWord, isDisabilityPtsd } from '../utils';
import { ptsdTypeEnum } from './ptsdTypeInfo';
import formConfig from '../config/form';
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
  const orientationPath =
    formConfig?.chapters.disabilities.pages.disabilitiesOrientation.path || '/';

  return (
    <>
      <p>
        Below is the list of disabilities you’re claiming in this application.
        If a disability is missing from the list, please{' '}
        <Link aria-label="Add missing disabilities" to={orientationPath}>
          go back and add it
        </Link>
        .
      </p>
      <ul>{selectedDisabilitiesList}</ul>
    </>
  );
};
