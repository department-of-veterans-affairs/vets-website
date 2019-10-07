import environment from 'platform/utilities/environment';
import { getCalculatedBenefits } from '../selectors/calculator';

export const formatNumber = value => {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
};

export const formatCurrency = value => `$${formatNumber(Math.round(+value))}`;

export const isVetTecSelected = filters =>
  filters.category === 'vettec' || filters.vetTecProvider;

export const addAllOption = options => [
  { value: 'ALL', label: 'ALL' },
  ...options,
];

export const isCountryUSA = country => country === 'USA';
export const isCountryInternational = country => !isCountryUSA(country);

export const locationInfo = (city, state, country) => {
  let address = '';
  if (isCountryUSA(country)) {
    if (city && state) {
      address = `${city}, ${state}`;
    } else if (!state && city) {
      address = `${city}`;
    } else if (state && !city) {
      address = `${state}`;
    }
  } else if (country) {
    if (city) {
      address = `${city}, ${country}`;
    } else {
      address = `${country}`;
    }
  }
  return address;
};

export const getSchoolLocationsCalculatedBenefits = (institution, props) => {
  const countryIsInternational = isCountryInternational(
    institution.physicalCountry,
  );
  const beneficiaryLocationQuestion =
    !environment.isProduction() && countryIsInternational ? 'other' : null;

  const schoolLocationCalculator = {
    ...props.calculator,
    classesOutsideUS: !environment.isProduction() && countryIsInternational,
    beneficiaryLocationQuestion,
  };

  const schoolLocationState = {
    constants: { constants: props.constants },
    eligibility: props.eligibility,
    profile: { attributes: institution },
    calculator: schoolLocationCalculator,
  };

  return getCalculatedBenefits(schoolLocationState, props);
};
