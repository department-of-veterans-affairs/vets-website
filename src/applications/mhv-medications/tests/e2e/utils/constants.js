export const Data = {
  PAGINATION_TEXT: 'Showing 1 - 10 of 29 medications',
  PAGINATION_ALL_MEDICATIONS:
    'Showing 1 - 10 of 29 medications, alphabetically by status',
  PAGINATION_ACTIVE_TEXT:
    'Showing 1 - 10 of 29 active medications, alphabetically by status',
  PAGINATION_RENEW:
    'Showing 1 - 10 of 29 renewal needed before refill medications, alphabetically by status',
  PAGINATION_NON_ACTIVE:
    'Showing 1 - 10 of 15 non-active medications, alphabetically by status',
  PAGINATION_RECENTLY_REQUESTED:
    'Showing 1 - 10 of 29 recently requested medications, alphabetically by status',
  ACTIVE_REFILL_IN_PROCESS: 'We expect to fill this prescription on',
  ACTIVE_NON_VA: 'You can’t manage this medication in this online tool.',
};
export const Paths = {
  LANDING_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  MED_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  SORT_BY_NAME:
    'my_health/v1/prescriptions?page=1&per_page=10&sort[]=prescription_name&sort[]=dispensed_date',
  SORT_BY_LAST_FILLED:
    'my_health/v1/prescriptions?page=1&per_page=10&sort[]=-dispensed_date&sort[]=prescription_name',
  SORT_BY_STATUS:
    '&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  ACTIVE_FILTER:
    '/my_health/v1/prescriptions?page=1&per_page=10&filter[[disp_status][eq]]=Active,Active:%20Refill%20in%20Process,Active:%20Non-VA,Active:%20On%20hold,Active:%20Parked,Active:%20Submitted&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  INTERCEPT: {
    PAGINATION_NEXT:
      '/my_health/v1/prescriptions?page=2&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',

    RECENTLY_REQUESTED_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=10&filter[[disp_status][eq]]=Active:%20Refill%20in%20Process,Active:%20Submitted&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
    RENEW_FILTER_LIST:
      'my_health/v1/prescriptions?page=1&per_page=10&filter[[disp_status][eq]]=Active,Expired&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
    NON_ACTIVE_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=10&filter[[disp_status][eq]]=Discontinued,Expired,Transferred,Unknown&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  },
};
export const Alerts = {
  EMPTY_MED_LIST: 'You don’t have any VA prescriptions or medication records',
  NO_FILTER_RESULTS: 'We didn’t find any matches for this filter',
};
