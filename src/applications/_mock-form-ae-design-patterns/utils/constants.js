import { getAppUrl } from '~/platform/utilities/registry-helpers';

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
  'task-green/veteran-information/edit-mailing-address',
  '/complete',
];
