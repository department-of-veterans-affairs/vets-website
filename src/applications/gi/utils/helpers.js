import { snakeCase } from 'lodash';
import constants from 'vets-json-schema/dist/constants.json';

export const formatNumber = value => {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
};

export const formatCurrency = value => `$${formatNumber(Math.round(+value))}`;

export const isVetTecSelected = filters => filters.category === 'vettec';

export const addAllOption = options => [
  { value: 'ALL', label: 'ALL' },
  ...options,
];

export const createId = name => name?.toLowerCase().replace(/\s/g, '-');

export const isCountryUSA = country => country.toUpperCase() === 'USA';
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

export const phoneInfo = (areaCode, phoneNumber) => {
  let providerPhone = '';
  if (areaCode && phoneNumber) {
    providerPhone = `${areaCode}-${phoneNumber}`;
  }
  return providerPhone;
};

/**
 * Snake-cases field names
 * @param query {Object} an object containing query fields
 * @returns {Object} query object with updated field names
 */
export const rubyifyKeys = query =>
  Object.keys(query).reduce(
    (queryParams, key) => ({
      ...queryParams,
      [snakeCase(key)]: query[key],
    }),
    {},
  );

export const isPresent = value => value && value !== '';

export const getStateNameForCode = stateCode => {
  const stateLabel = constants.states.USA.find(
    state => state.value.toUpperCase() === stateCode.toUpperCase(),
  );
  return stateLabel !== undefined ? stateLabel.label : stateCode.toUpperCase();
};

export const sortOptionsByStateName = (stateA, stateB) => {
  if (stateA.label < stateB.label) {
    return -1;
  }
  if (stateA.label > stateB.label) {
    return 1;
  }
  return 0;
};

export const removeNonNumberCharacters = value =>
  value.toString().replace(/([^0-9.])+/g, '');

export const formatDollarAmount = value => {
  const output = value != null ? removeNonNumberCharacters(value) : 0;
  return formatCurrency(output);
};

export const checkForEmptyFocusableElement = element => {
  if (document.getElementsByName(element) === null) {
    return '';
  }
  return document.getElementsByName(element);
};
