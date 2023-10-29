import { isOfCollegeAge } from './helpers/household';
import { replaceStrValues } from './helpers/general';
import content from '../locales/en/content.json';

const date = new Date();
const lastYear = date.getFullYear() - 1;

// declare view fields for use in household section
export const DEPENDENT_VIEW_FIELDS = {
  add: 'view:reportDependents',
  skip: 'view:skipDependentInfo',
};

// declare subpage configs for dependent information page
export const DEPENDENT_SUBPAGES = [
  {
    id: 'basic',
    title: content['household-dependent-info-basic-title'],
  },
  {
    id: 'education',
    title: content['household-dependent-info-education-title'],
    depends: { key: 'dateOfBirth', value: isOfCollegeAge },
  },
  {
    id: 'additional',
    title: content['household-dependent-info-addtl-title'],
  },
  {
    id: 'support',
    title: content['household-dependent-info-support-title'],
    depends: { key: 'cohabitedLastYear', value: false },
  },
  {
    id: 'income',
    title: replaceStrValues(
      content['household-dependent-info-income-title'],
      lastYear,
      '%d',
    ),
    depends: { key: 'view:dependentIncome', value: true },
  },
];

// declare prefix for use in GA events related to disability rating
export const DISABILITY_PREFIX = 'disability-ratings';

// declare action statuses for fetching disability rating
export const DISABILITY_RATING_ACTIONS = {
  FETCH_DISABILITY_RATING_STARTED: 'FETCH_DISABILITY_RATING_STARTED',
  FETCH_DISABILITY_RATING_SUCCEEDED: 'FETCH_DISABILITY_RATING_SUCCEEDED',
  FETCH_DISABILITY_RATING_FAILED: 'FETCH_DISABILITY_RATING_FAILED',
};

// declare initial state for disability rating reducer
export const DISABILITY_RATING_INIT_STATE = {
  totalDisabilityRating: null,
  loading: true,
  error: null,
};

// declare action statuses for fetching enrollment status
export const ENROLLMENT_STATUS_ACTIONS = {
  FETCH_ENROLLMENT_STATUS_STARTED: 'FETCH_ENROLLMENT_STATUS_STARTED',
  FETCH_ENROLLMENT_STATUS_SUCCEEDED: 'FETCH_ENROLLMENT_STATUS_SUCCEEDED',
  FETCH_ENROLLMENT_STATUS_FAILED: 'FETCH_ENROLLMENT_STATUS_FAILED',
};

// declare initial state for entrollment status reducer
export const ENROLLMENT_STATUS_INIT_STATE = {
  hasServerError: false,
  parsedStatus: null,
  loading: false,
};

// declare the minimum percentage value to be considered high disability
export const HIGH_DISABILITY_MINIMUM = 50;

// declare view fields for use in insurance info section
export const INSURANCE_VIEW_FIELDS = {
  add: 'view:addInsurancePolicy',
  skip: 'view:skipInsuranceInfo',
};

export const MOCK_ENROLLMENT_REPSONSE = {
  applicationDate: '2019-04-24T00:00:00.000-06:00',
  enrollmentDate: '2019-04-30T00:00:00.000-06:00',
  preferredFacility: '463 - CHEY6',
  parsedStatus: 'enrolled',
  effectiveDate: '2019-04-25T00:00:00.000-06:00',
};

// declare names to use for window session storage items
export const SESSION_ITEMS = {
  dependent: 'ezrDependentIndex',
  insurance: 'ezrPolicyIndex',
};

// declare routes that are shared between custom form pages
export const SHARED_PATHS = {
  dependents: {
    summary: 'household-information/dependents',
    info: 'household-information/dependent-information',
  },
  insurance: {
    summary: 'insurance-information/policies',
    info: 'insurance-information/policy-information',
  },
};

// declare default SIGI values
export const SIGI_GENDERS = {
  NB: 'Non-binary',
  M: 'Man',
  F: 'Woman',
  TM: 'Transgender man',
  TF: 'Transgender woman',
  O: 'A gender not listed here',
  NA: 'Prefer not to answer',
};

// declare default schema for view fields
export const VIEW_FIELD_SCHEMA = {
  type: 'object',
  properties: {},
};
