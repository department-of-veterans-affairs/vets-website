import { getAppUrl } from '~/platform/utilities/registry-helpers';
import { isOfCollegeAge, hasGrossIncome } from './helpers/household';
import { replaceStrValues } from './helpers/general';
import content from '../shared/locales/en/content.json';

export const MOCK_FORM_AE_DESIGN_PATTERNS_ROOT_URL =
  '/mock-form-ae-design-patterns';

export const TASKS = {
  GREEN: 'task-green',
  YELLOW: 'task-yellow',
  PURPLE: 'task-purple',
};

// declare previous year for form questions and content
export const LAST_YEAR = new Date().getFullYear() - 1;

// declare view fields for use in household section
export const DEPENDENT_VIEW_FIELDS = {
  add: 'view:reportDependents',
  skip: 'view:skipDependentInfo',
};

// declare view fields for use in insurance info section
export const INSURANCE_VIEW_FIELDS = {
  add: 'view:addInsurancePolicy',
  skip: 'view:skipInsuranceInfo',
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

// declare military city codes to use for prefill transformer
export const MILITARY_CITIES = ['APO', 'FPO', 'DPO'];

// declare default schema for view fields
export const VIEW_FIELD_SCHEMA = {
  type: 'object',
  properties: {},
};
// declare global app URLs for use with content links
export const APP_URLS = {
  hca: getAppUrl('hca'),
  verify: getAppUrl('verify'),
  facilities: getAppUrl('facilities'),
};

export const LOCATIONS_TO_REMOVE_FORM_HEADER = [
  '/1/task-green/veteran-information/edit-mailing-address',
  '/complete',
];
