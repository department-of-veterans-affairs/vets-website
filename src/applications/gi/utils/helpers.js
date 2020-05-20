import { snakeCase } from 'lodash';
import constants from 'vets-json-schema/dist/constants.json';
import { SMALL_SCREEN_WIDTH } from '../constants';

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

export const isMobileView = () => window.innerWidth <= SMALL_SCREEN_WIDTH;

export const handleScrollOnInputFocus = fieldId => {
  if (isMobileView()) {
    const field = document.getElementById(fieldId);
    field.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

export const handleInputFocusWithPotentialOverLap = (
  fieldId1,
  fieldId2,
  scrollableFieldId,
) => {
  if (isMobileView()) {
    const field1 = document.getElementById(fieldId1);
    const field2 = document.getElementById(fieldId2);
    if (field1 && field2) {
      field1.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const fieldRect1 = field1.getBoundingClientRect();
      const fieldRect2 = field2.getBoundingClientRect();
      const hasOverLap = !(
        fieldRect1.right < fieldRect2.left ||
        fieldRect1.left > fieldRect2.right ||
        fieldRect1.bottom < fieldRect2.top ||
        fieldRect1.top > fieldRect2.bottom
      );
      if (hasOverLap === true) {
        const scrollableField =
          document.getElementById(scrollableFieldId) || window;
        const scrollUpBy = fieldRect1.bottom - fieldRect2.top + 2;
        scrollableField.scrollBy({
          top: scrollUpBy,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }
};
