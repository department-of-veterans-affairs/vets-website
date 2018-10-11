import React from 'react';
import { getDisabilityName } from '../utils';

export const SummaryOfDisabilitiesDescription = ({ formData }) => {
  const { ratedDisabilities, newDisabilities } = formData;
  const ratedDisabilityNames = ratedDisabilities
    ? ratedDisabilities
        .filter(disability => disability['view:selected'])
        .map(disability => getDisabilityName(disability.name))
    : [];
  const newDisabilityNames = newDisabilities
    ? newDisabilities.map(disability => getDisabilityName(disability.condition))
    : [];
  const selectedDisabilitiesList = ratedDisabilityNames
    .concat(newDisabilityNames)
    .map((name, i) => <li key={`"${name}-${i}"`}>{name}</li>);
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
