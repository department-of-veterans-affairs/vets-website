import { snakeCase } from 'lodash';
import URLSearchParams from 'url-search-params';
import { useLocation } from 'react-router-dom';

import constants from 'vets-json-schema/dist/constants.json';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';

import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import mapboxClient from '../components/MapboxClient';

const mbxClient = mbxGeo(mapboxClient);
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

export const isCountryUSA = country => country?.toUpperCase() === 'USA';

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

export const formatCurrency = value => {
  if (isNaN(value)) {
    return value;
  }
  return `$${formatNumber(Math.round(+value))}`;
};

export const removeNonNumberCharacters = value =>
  value.toString().replace(/([^0-9.])+/g, '');

export const formatDollarAmount = value => {
  const output = value != null ? removeNonNumberCharacters(value) : 0;
  return formatCurrency(output);
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
        if (scrollableField) {
          const pixelOffset = 10;
          const scrollUpBy = fieldRect1.bottom - fieldRect2.top + pixelOffset;
          scrollableField.scrollBy({
            top: scrollUpBy,
            left: 0,
            behavior: 'smooth',
          });
        }
      }
    }
  }
};

export const addAllOption = options => [
  { optionValue: 'ALL', optionLabel: 'All' },
  ...options,
];

export const getStateNameForCode = stateCode => {
  const stateLabel = constants.states.USA.find(
    state => state?.value?.toUpperCase() === stateCode?.toUpperCase(),
  );
  return stateLabel !== undefined ? stateLabel.label : stateCode?.toUpperCase();
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

export const searchCriteriaFromCoords = async (longitude, latitude) => {
  const response = await mbxClient
    .reverseGeocode({
      query: [longitude, latitude],
      types: ['address'],
    })
    .send();

  const { features } = response.body;
  const placeName = features[0].place_name;

  return {
    searchString: placeName,
    position: { longitude, latitude },
  };
};

export const schoolSize = enrollment => {
  if (!enrollment || !Number.isInteger(enrollment)) return 'Unknown';
  if (enrollment <= 2000) {
    return 'Small';
  }
  if (enrollment <= 15000) {
    return 'Medium';
  }
  return 'Large';
};

export function isURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

export const upperCaseFirstLetterOnly = str =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const naIfNull = value => {
  return value || 'N/A';
};

export const boolYesNo = field => {
  return field ? 'Yes' : 'No';
};

export const isSmallScreen = () => matchMedia('(max-width: 480px)').matches;

export const scrollToFocusedElement = () => {
  const compareDrawerHeight = document.getElementById('compare-drawer')
    ?.clientHeight;
  const activeElementBounding = document.activeElement.getBoundingClientRect();

  if (
    compareDrawerHeight &&
    activeElementBounding.bottom > window.innerHeight - compareDrawerHeight
  ) {
    scroller.scrollTo(document.activeElement.id, getScrollOptions());
  }
};

export const getAvgCount = (questionsArrObj, index) => {
  let result = '-1';
  const questionObj = questionsArrObj[index];
  const keys = Object.keys(questionObj);
  const values = Object.values(questionObj);
  keys.forEach((keyValue, keyIndex) => {
    if (keyValue.includes('Avg')) {
      result = values[keyIndex];
    }
  });
  return result;
};

const SMFKey = 'smf-title';
export const specializedMissionDefinitions = [
  {
    key: `${SMFKey}-HBCU`,
    title: 'Historically Black college or university',
    definition:
      'HBCU’s are colleges and universities founded before 1964 and were originally intended to provide higher education to African American communities.',
  },
  {
    key: `${SMFKey}-MENONLY`,
    title: 'Men-only',
    definition:
      "Men's colleges in the United States are primarily those categorized as being undergraduate, bachelor's degree-granting single-sex institutions that admit only men.",
  },
  {
    key: `${SMFKey}-WOMENONLY`,
    title: 'Women-only',
    definition:
      "Women's colleges in the United States are private single-sex U.S. institutions of higher education that only admit female students.",
  },
  {
    key: `${SMFKey}-RELAFFIL`,
    title: 'Religious affiliation',
    definition:
      'Religiously affiliated colleges and universities are as diverse as their religious traditions and the higher education scene in the United States. ',
  },
  {
    key: `${SMFKey}-HSI`,
    title: 'Hispanic-serving institutions',
    definition:
      'An HSI is an institution that receives federal discretionary funding to improve and expand its capacity to serve Hispanic and low-income students. ',
  },
  {
    key: `${SMFKey}-NANTI`,
    title: 'Native American-serving institutions',
    definition:
      'A Native American-Serving Non-Tribal Institution is a postsecondary institution that is not affiliated with American Indian and Native Alaskan tribes and receives federal discretionary funding to improve and expand its capacity to serve Native American students. ',
  },
  {
    key: `${SMFKey}-TRIBAL`,
    title: 'Tribal college and university',
    definition:
      'TCU’s are colleges and universities associated with American Indian and Native Alaskan tribes.',
  },
  {
    key: `${SMFKey}-AANAPISI`,
    title:
      'Asian American Native American Pacific Islander-serving institutions',
    definition:
      'An AANAPISI is an institution that receives federal discretionary funding to improve and expand its capacity to serve Asian Americans and Native American Pacific Islanders and low-income students.',
  },
  {
    key: `${SMFKey}-PBI`,
    title: 'Predominantly Black institutions',
    definition:
      'A Predominantly Black Institution is a postsecondary institution that receives discretionary funding to improve and expand its capacity to serve black students as well as low-income and first-generation college students. ',
  },
  {
    key: `${SMFKey}-ANNHI`,
    title: 'Alaska Native-serving institutions',
    definition:
      'An Alaska Native-serving Institution is a postsecondary institution that receives federal discretionary funding to improve and expand its capacity to serve Alaska Native students.',
  },
];
