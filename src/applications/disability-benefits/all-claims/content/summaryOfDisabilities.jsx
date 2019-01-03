import React from 'react';
import { capitalizeEachWord } from '../utils';
import { isDisabilityPtsd } from '../validations';
import { ptsdTypeEnum } from './ptsdTypeInfo';

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
        .map(disability => capitalizeEachWord(disability.name))
    : [];
  const newDisabilityNames = newDisabilities
    ? newDisabilities.map(disability =>
        capitalizeEachWord(disability.condition),
      )
    : [];
  const selectedDisabilitiesList = ratedDisabilityNames
    .concat(newDisabilityNames)
    .map((name, i) => mapDisabilityName(name, formData, i));
  return (
    <div>
      <p>
        Below is the list of disabilities you’re claiming in this application.
        If a disability is missing from the list, please go back one screen and
        add it.
      </p>
      <ul>{selectedDisabilitiesList}</ul>
    </div>
  );
};
