export const DETAILS_BC_LABEL = 'details breadcrumb';
export const SUBMISSIONS_BC_LABEL = 'submissions breadcrumb';

export const submissionsBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Submissions',
  },
];
export const SEARCH_PARAMS = {
  SORTBY: 'sortBy',
  SORTORDER: 'sortOrder',
  SIZE: 'pageSize',
  NUMBER: 'pageNumber',
};
export const SORT_BY = {
  CREATED: 'created_at',
  RESOLVED: 'resolved_at',
  ASC: 'asc',
  DESC: 'desc',
};

export const SORT_OPTIONS = {
  DESC_OPTION: 'Submitted date (newest)',
  ASC_OPTION: 'Submitted date (oldest)',
};

export const SORT_DEFAULTS = {
  SORT_BY: 'created_at',
  SORT_ORDER: 'desc',
  // default is 20 per page
  SIZE: 20,
  // default is page 1
  NUMBER: 1,
};
