import { getAppUrl } from '~/platform/utilities/registry-helpers';

import { isOfCollegeAge, hasGrossIncome } from './helpers/household';
import { replaceStrValues } from './helpers/general';
import content from '../locales/en/content.json';

// declare previous year for form questions and content
export const LAST_YEAR = new Date().getFullYear() - 1;

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
    id: 'additional',
    title: content['household-dependent-info-addtl-title'],
  },
  {
    id: 'support',
    title: content['household-dependent-info-support-title'],
    depends: [{ key: 'cohabitedLastYear', value: false }],
  },
  {
    id: 'income',
    title: replaceStrValues(
      content['household-dependent-info-income-title'],
      LAST_YEAR,
      '%d',
    ),
    depends: [{ key: 'view:dependentIncome', value: true }],
  },
  {
    id: 'education',
    title: content['household-dependent-info-education-title'],
    depends: [
      {
        key: 'dateOfBirth',
        value: isOfCollegeAge,
      },
      {
        key: 'view:dependentIncome',
        value: true,
      },
      {
        key: 'view:grossIncome',
        value: hasGrossIncome,
      },
    ],
  },
];

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

// declare military city codes to use for prefill transformer
export const MILITARY_CITIES = ['APO', 'FPO', 'DPO'];

// declare mock response for enrollment status API to use for simulated testing
export const MOCK_ENROLLMENT_RESPONSE = {
  applicationDate: '2019-04-24T00:00:00.000-06:00',
  enrollmentDate: '2019-04-30T00:00:00.000-06:00',
  preferredFacility: '463 - CHEY6',
  parsedStatus: 'enrolled',
  effectiveDate: '2019-04-25T00:00:00.000-06:00',
  canSubmitFinancialInfo: true,
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

// declare default schema for view fields
export const VIEW_FIELD_SCHEMA = {
  type: 'object',
  properties: {},
};

// declare valid enrollment statuses
export const VALID_ENROLLMENT_STATUSES = [
  'enrolled',
  'pending_mt',
  'pending_other',
];

// declare global app URLs for use with content links
export const APP_URLS = {
  hca: getAppUrl('hca'),
  verify: getAppUrl('verify'),
  facilities: getAppUrl('facilities'),
};

export const MAX_NEXT_OF_KINS = 2;
export const MAX_EMERGENCY_CONTACTS = 2;

export const API_ENDPOINTS = {
  csrfCheck: '/maintenance_windows',
  downloadPdf: '/form1010_ezrs/download_pdf',
  enrollmentStatus: '/health_care_applications/enrollment_status',
};
