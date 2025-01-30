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
  PREVIOUS_PRESCRIPTION_PAGINATION:
    'Showing 1 to 2 of 26 prescriptions, from newest to oldest',
  PREVIOUS_PRESCRIPTION_PAGINATION_SECOND:
    'Showing 3 to 4 of 26 prescriptions, from newest to oldest',
  PREVIOUS_PRESCRIPTION_PAGINATION_THIRD:
    'Showing 5 to 6 of 26 prescriptions, from newest to oldest',
  REFILL_HISTORY_INFO: 'Showing 12 refills, from newest to oldest',
  FILL_DATE_FIELD: 'Filled by pharmacy on',
  IMAGE_FIELD: 'Image',
  MED_DESCRIPTION: 'Medication description',
  LAST_FILLED_DATE: 'Last filled on March 18, 2024',
  REFILL_LINK_TEXT: 'Request a refill',
  ORIGINAL_FILL_LINK_TEXT: 'Request a fill',
  SINGLE_REFILL_HISTORY_INFO: 'Showing 1 refill',
  SINGLE_PREVIOUS_RX_INFO: 'Showing 1 prescription',
  SINGLE_CERNER_FACILITY_USER:
    'Some of your medications may be in a different portal. To view or manage medications at VA Spokane health care, go to My VA Health.',
  CERNER_FACILITY_ONE: 'VA Spokane health care',
  CERNER_FACILITY_TWO: 'VA Roseburg health care',
  MULTIPLE_CERNER_TEXT_ALERT:
    'Some of your medications may be in a different portal. To view or manage medications at these facilities, go to My VA Health',
  PENDING_RX_CARD_INFO:
    'This is a new prescription from your provider. Your VA pharmacy is reviewing it now. Details may change.',
  PENDING_ALERT_TEXT: 'Your VA pharmacy is still reviewing this prescription',
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
  NO_ACCESS_TO_MEDICATIONS_ERROR: 'We can’t access your medications right now',
};
