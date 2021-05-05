import { createSelector } from 'reselect';

import { getDerivedAttributes as getDefaultDerivedAttributes } from './estimator';

const getConstants = state => state.constants.constants;

const getEligibilityDetails = state => state.eligibility;

const getRequiredAttributes = (state, props) => {
  const { type, bah, dodBah, country } = props.result;
  return {
    type: type && type.toLowerCase(),
    bah,
    dodBah,
    country: country && country.toLowerCase(),
  };
};
export function getDerivedAttributes(constant, eligibility, institution) {
  const defaultDerived = getDefaultDerivedAttributes(
    constant,
    eligibility,
    institution,
  );

  const onlineDodRate = constant.AVGDODBAH * 0.5;
  const dodZipCodeHousingRate = institution.dodBah;

  return {
    ...defaultDerived,
    onlineDodRate,
    dodZipCodeHousingRate,
  };
}
// eslint-disable-next-line no-unused-vars
function calculateTuition(constant, eligibility, institution, derived) {
  return {
    qualifier: null,
    value: 'TBD',
  };
}

function calculateHousing(constant, eligibility, institution, derived) {
  const { learningFormat } = eligibility;
  const { inPerson, online } = learningFormat;

  if (online && !inPerson) {
    return {
      qualifier: 'per month',
      value: Math.round(derived.onlineDodRate),
    };
  } else if (inPerson && !online) {
    return {
      qualifier: 'per month',
      value: Math.round(derived.dodZipCodeHousingRate),
    };
  } else if ((inPerson && online) || (!inPerson && !online)) {
    return {
      qualifier: 'per month range',
      range: {
        start: Math.round(derived.onlineDodRate),
        end: Math.round(derived.dodZipCodeHousingRate),
      },
    };
  }

  return {
    qualifier: null,
    value: 'TBD',
  };
}

export const estimatedBenefits = createSelector(
  [getConstants, getEligibilityDetails, getRequiredAttributes],
  (constant, eligibility, attribute) => {
    if (constant === undefined) return {};

    const derived = getDerivedAttributes(constant, eligibility, attribute);
    const tuition = calculateTuition(constant, eligibility, attribute, derived);
    const housing = calculateHousing(constant, eligibility, attribute, derived);

    return {
      tuition,
      housing,
    };
  },
);
