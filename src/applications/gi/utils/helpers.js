import { snakeCase } from 'lodash';
import URLSearchParams from 'url-search-params';
import { useLocation } from 'react-router-dom';

import constants from 'vets-json-schema/dist/constants.json';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';

import { scroller } from 'react-scroll';
import { getScrollOptions } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';
import mapboxClient from '../components/MapboxClient';

const mbxClient = mbxGeo(mapboxClient);
import {
  SMALL_SCREEN_WIDTH,
  PREVIOUS_URL_PUSHED_TO_HISTORY,
  filterKeys,
  ERROR_MESSAGES,
} from '../constants';

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

export const isReviewInstance = () => {
  const { hostname } = window.location;
  const globalRegex = new RegExp('review.vetsgov-internal', 'g');
  return globalRegex.test(hostname);
};

export const isProductionOrTestProdEnv = (automatedTest = false) => {
  const isTest = global && global?.window && global?.window?.buildType;
  if (isTest || automatedTest) {
    return false;
  }
  return (
    environment.isProduction() ||
    environment.isStaging() ||
    environment.isDev() ||
    isReviewInstance() ||
    environment.isLocalhost()
  );
};

export const isShowCommunityFocusVACheckbox = (automatedTest = false) => {
  const isTest = global && global?.window && global?.window?.buildType;
  if (environment.isDev() || isTest || automatedTest) {
    return false;
  }
  return (
    environment.isLocalhost() ||
    environment.isStaging() ||
    isReviewInstance() ||
    environment.isProduction()
  );
};

export const isShowVetTec = (automatedTest = false) => {
  const isTest = global && global?.window && global?.window?.buildType;
  if (isTest || automatedTest) {
    return false;
  }
  return environment.isDev();
  // Or
  /*
  return (
    environment.isProduction() || // Comment out to send to production
    environment.isStaging() ||
    environment.isDev() ||
    isReviewInstance() ||
    environment.isLocalhost()
  ); */
};

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
    full += 1;
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

const isPortrait = () => {
  return window.matchMedia('(orientation: portrait)').matches;
};

export const isSmallScreenLogic = (maxWidth = 480) =>
  matchMedia(`(max-width: ${maxWidth}px)`).matches;

export const isSmallScreen = (maxWidth = 480) => {
  const portrait = isPortrait();
  const smallScreen = isSmallScreenLogic(maxWidth);
  const browserZoomLevel = Math.round(window.devicePixelRatio * 100);
  return (smallScreen && portrait) || (smallScreen && browserZoomLevel <= 150);
};

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
    title: 'Historically Black Colleges and Universities',
    definition:
      'Historically Black Colleges and Universities (HBCUs) are colleges and universities founded before 1964 and were originally intended to provide higher education to African American communities.',
  },
  {
    key: `${SMFKey}-MENONLY`,
    title: 'Men’s colleges and universities',
    definition:
      "Men's colleges in the United States are primarily those categorized as being undergraduate, bachelor's degree-granting single-sex institutions that admit only men.",
  },
  {
    key: `${SMFKey}-WOMENONLY`,
    title: 'Women’s colleges and universities',
    definition:
      "Women's colleges in the United States are private single-sex U.S. institutions of higher education that only admit female students.",
  },
  {
    key: `${SMFKey}-RELAFFIL`,
    title: 'Religiously-affiliated institutions',
    definition:
      'A religiously-affiliated institution identifies with a specific religious group.',
  },
  {
    key: `${SMFKey}-HSI`,
    title: 'Hispanic-Serving Institutions',
    definition:
      'A Hispanic-Serving Institution (HSI) that receives federal funding to help serve Hispanic and low-income students. At least 25% of the school’s full-time undergraduate students identify as Hispanic.',
  },
  {
    key: `${SMFKey}-NANTI`,
    title: 'Native American-Serving Nontribal Institutions',
    definition:
      'A Native American-Serving Nontribal Institution is a postsecondary institution that is not affiliated with American Indian and Native Alaskan tribes and receives federal discretionary funding to improve and expand its capacity to serve Native American students. ',
  },
  {
    key: `${SMFKey}-TRIBAL`,
    title: 'Tribal Colleges and Universities',
    definition:
      'Tribal Colleges and Universities (TCUs) are schools that tribal nations and the federal government set up to serve Native American and Alaskan Native students. Most TCUs are on or near reservation lands. ',
  },
  {
    key: `${SMFKey}-AANAPISI`,
    title:
      'Asian American and Native American Pacific Islander-Serving Institutions',
    definition:
      'An Asian American Native American Pacific Islander-Serving Institution (AANAPISI) is a college or university  that receives federal funding to help serve Asian Americans and Native American Pacific Islanders and low-income students. At least 10% of the school’s full-time undergraduate students identify as Asian American and Native American Pacific Islander.',
  },
  {
    key: `${SMFKey}-PBI`,
    title: 'Predominantly Black Institutions',
    definition:
      'A Predominantly Black Institution (PBI) receives federal funding to help serve black students, as well as low-income and first-generation students. At least 40% of the school’s undergraduate students are Black.',
  },
  {
    key: `${SMFKey}-ANNHI`,
    title: 'Alaska Native-Serving Institutions',
    definition:
      'An Alaska Native-Serving Institution (ANSI) is a college or university  that receives federal funding to help serve Alaska Native students. At least 20% of the school’s full-time undergraduate students identify as Alaska Native.',
  },
];

export const sortedSpecializedMissionDefinitions = () => {
  return specializedMissionDefinitions.sort((a, b) =>
    a.title.localeCompare(b.title),
  );
};

export const validateSearchTerm = (searchTerm, dispatchError, error, type) => {
  const empty = searchTerm.trim() === '';
  const invalidZipCodePattern = /^\d{6,}$/;

  if (
    type === 'name' &&
    error === ERROR_MESSAGES.searchByNameInputEmpty &&
    !empty
  ) {
    dispatchError(null);
  } else if (type === 'location') {
    if (error === ERROR_MESSAGES.searchbyLocationInputEmpty && !empty) {
      dispatchError(null);
    } else if (
      error === ERROR_MESSAGES.invalidZipCode &&
      !invalidZipCodePattern.test(searchTerm)
    )
      dispatchError(null);
  }
};

export const validateSearchTermSubmit = (
  searchTerm,
  dispatchError,
  error,
  filters,
  type,
) => {
  const empty = searchTerm.trim() === '';
  const invalidZipCodePattern = /^\d{6,}$/;

  if (type === 'name') {
    if (empty) {
      dispatchError(ERROR_MESSAGES.searchByNameInputEmpty);
    } else if (filterKeys.every(key => filters[key] === false)) {
      dispatchError(ERROR_MESSAGES.checkBoxFilterEmpty);
    } else if (error !== null) {
      dispatchError(null);
    }
    return !empty && !filterKeys.every(key => filters[key] === false);
  }

  if (type === 'location') {
    if (empty) {
      dispatchError(ERROR_MESSAGES.searchbyLocationInputEmpty);
    } else if (invalidZipCodePattern.test(searchTerm)) {
      dispatchError(ERROR_MESSAGES.invalidZipCode);
    } else if (filterKeys.every(key => filters[key] === false)) {
      dispatchError(ERROR_MESSAGES.checkBoxFilterEmpty);
    } else if (error !== null) {
      dispatchError(null);
    }
    return (
      !empty &&
      !filterKeys.every(key => filters[key] === false) &&
      !invalidZipCodePattern.test(searchTerm)
    );
  }

  return !empty;
};

export const isEmptyCheckboxFilters = filters => {
  let isEmpty = true;

  if (!filterKeys.every(key => filters[key] === false)) isEmpty = false;

  return isEmpty;
};

export const currentTab = () => {
  const url = new URL(window.location);
  const { searchParams } = url;
  return searchParams.get('search');
};

export const isSearchInstitutionPage = () => {
  const { pathname } = window.location;
  const globalRegex = new RegExp(
    '/education/gi-bill-comparison-tool/institution/',
    'g',
  );
  return globalRegex.test(pathname);
};

export const isSearchByNamePage = () => {
  return (
    (currentTab() === 'name' || currentTab() === null) &&
    !isSearchInstitutionPage()
  );
};

export const isSearchByLocationPage = () => {
  return currentTab() === 'location';
};

export const giDocumentTitle = () => {
  let crumbLiEnding = 'GI Bill® Comparison Tool ';
  const searchByName = isSearchByNamePage();
  const searchByLocationPage = isSearchByLocationPage();
  if (searchByName) {
    crumbLiEnding += '(Search By Name)';
  } else if (searchByLocationPage) {
    crumbLiEnding += '(Search By Location)';
  }
  return crumbLiEnding;
};

export const setDocumentTitle = () => {
  document.title = `${giDocumentTitle()} | Veterans Affairs`;
};

export const managePushHistory = (history, url) => {
  const previousUrl = window.sessionStorage.getItem(
    PREVIOUS_URL_PUSHED_TO_HISTORY,
  );
  if (url !== previousUrl) {
    window.sessionStorage.setItem(PREVIOUS_URL_PUSHED_TO_HISTORY, url);
    history.push(url);
  }
};
export function showSchoolContentBasedOnType(type) {
  const validateTypes = {
    FLIGHT: false,
    CORRESPONDENCE: false,
  };
  return !(type in validateTypes);
}

export const getGIBillHeaderText = (automatedTest = false) => {
  return isShowVetTec(automatedTest)
    ? 'Learn about and compare your GI Bill benefits at approved schools, employers, and VET TEC providers.'
    : 'Learn about and compare your GI Bill benefits at approved schools and employers.';
};

export const updateLcFilterDropdowns = (dropdowns, target) => {
  const updatedFieldIndex = dropdowns.findIndex(dropdown => {
    return dropdown.label === target.id;
  });

  const selectedOptionIndex = dropdowns[updatedFieldIndex].options.findIndex(
    option => option.optionValue === target.value,
  );

  return dropdowns.map(
    (dropdown, index) =>
      index === updatedFieldIndex
        ? {
            ...dropdown,
            current: dropdown.options[selectedOptionIndex],
          }
        : dropdown,
  );
};

export const handleLcResultsSearch = (history, name, type) => {
  return name
    ? history.push(`/lc-search/results?type=${type}&name=${name}`)
    : history.push(`/lc-search/results?type=${type}`);
};

export const formatProgramType = programType => {
  if (!programType) return '';

  return programType
    .split('-')
    .filter(word => word.trim()) // Filter out empty strings caused by extra hyphens
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const generateMockPrograms = numPrograms => {
  const programNames = [
    'CERTIFIED ETHICAL HACKER',
    'CISCO SYSTEMS - CCDA',
    'CERTIFIED INFORMATION SYSTEMS SECURITY',
    'VMWARE CERTIFIED ASSOCIATE',
    'MICROSOFT CERTIFIED PROFESSIONAL',
    'CISCO SYSTEMS - CCDP',
    'CISCO SYSTEMS - CCNA',
    'CISCO SYSTEMS - CCNA SECURITY',
    'CISCO SYSTEMS - CCNA VOICE',
    'CISCO SYSTEMS - CCNA WIRELESS',
    'DATABASE AND SOFTWARE DEVELOPER',
    'CISCO SYSTEMS - CCNP',
    'CISCO SYSTEMS - CCNP SECURITY',
    'CISCO SYSTEMS - CCNP VOICE',
    'CISCO SYSTEMS - CCNP WIRELESS',
    'COMPTIA A PLUS',
    'COMPTIA LINUX PLUS',
    'COMPTIA NETWORK PLUS',
    'COMPTIA SECURITY PLUS',
    'NETWORK SECURITY ENGINEER',
    'IT SYSTEMS ENGINEER',
    'MICROSOFT CERTIFIED SOLUTIONS ASSOCIATE',
  ];

  return Array.from({ length: numPrograms }, (_, index) => ({
    id: (index + 1).toString(),
    type: 'institution_programs',
    attributes: {
      programType: 'NCD',
      description: programNames[index % programNames.length],
      facilityCode: '3V000242',
      institutionName: 'LAB FOUR PROFESSIONAL DEVELOPMENT CENTER - NASHVILLE',
    },
  }));
};
