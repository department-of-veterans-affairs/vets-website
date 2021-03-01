import { snakeCase } from 'lodash';
import URLSearchParams from 'url-search-params';
import { useLocation } from 'react-router-dom';
import { SMALL_SCREEN_WIDTH } from '../constants';

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

export const formatNumber = value => {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
};

export const isPresent = value => value && value !== '';

export const createId = name => name?.toLowerCase().replace(/\s/g, '-');

export const isMobileView = () => window.innerWidth <= SMALL_SCREEN_WIDTH;

export const isCountryUSA = country => country.toUpperCase() === 'USA';

export const isCountryInternational = country => !isCountryUSA(country);

export function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}

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

export function convertRatingToStars(rating) {
  const ratingValue = parseFloat(rating);

  if (!ratingValue || isNaN(ratingValue)) {
    return null;
  }

  const rounded = ratingValue.toFixed(1);
  let full = parseInt(rounded.split('.')[0], 10);
  const firstDecimal = parseInt(rounded.split('.')[1], 10);

  let half = false;

  if (firstDecimal > 7) {
    full++;
  } else if (firstDecimal >= 3) {
    half = true;
  }

  return { full, half, display: rounded };
}

export const handleScrollOnInputFocus = fieldId => {
  const field = document.getElementById(fieldId);
  if (field && isMobileView()) {
    field.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};
