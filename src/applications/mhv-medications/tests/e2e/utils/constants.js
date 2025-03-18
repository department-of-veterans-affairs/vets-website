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
  PENDING_RENEW_TEXT: 'This is a renewal you requested.',
  PENDING_ALERT_WITHIN_SEVEN_DAYS:
    'Your VA pharmacy is reviewing this prescription',
  DELAY_ALERT_BANNER: 'Some refills are taking longer than expected',
  DELAY_ALERT_DETAILS_BANNER:
    'Your refill request for this medication is taking longer than expected',
  CHECK_STATUS_HEADER: 'Check the status of your next refill',
  HELP_TEXT: 'Need help?',
  LIST_PAGE_TITLE_NOTES: 'Bring your medications list',
  PROGRESS_LIST_HEADER: 'How the refill process works',
  STEP_ONE_HEADER: 'You request a refill',
  STEP_TWO_HEADER: 'We process your refill request',
  STEP_THREE_HEADER: 'We ship your refill to you',
  STEP_THREE_NOTE:
    'Remember to request your next refill at least 15 days before ',
  STEP_ONE_SUBMITTED: 'We received your refill request',
  STEP_TWO_SUBMITTED: 'We’ll process your refill request',
  STEP_THREE_SUBMITTED: 'ship your refill',
  STEP_THREE_SUBMIT_ABOVE: 'Step 3: NOT STARTED',
  STEP_TWO_ACTIVE: 'We processed your refill',
  STEP_THREE_SHIPPED: 'We shipped your refill',
  STEP_ONE_NOTE_ABOVE: 'Step 1: Completed',
  STEP_TWO_PROCESS_ABOVE_TEXT: 'Step 2: Completed',
  STEP_ONE_DATE_TEXT: 'Step 1: Completed',
  STEP_ONE_NO_DATE: 'Date completed not available',
  STEP_TWO_DATE: 'Completed on October 1, 2023',
  STEP_THREE_NOTE_ABOVE: 'Step 3: Completed',
  STEP_THREE_DATE: 'Completed on September 24, 2024',
  STEP_THREE_NO_TRACKING:
    'We’ll provide the tracking information when available.',
  STEP_THREE_NOT_STARTED: 'Step 3: Not started',
  TOOL_TIP_TEXT: 'Filter the medications list',
  QUANTITY_EMPTY: 'Quantity not available',
  DATE_EMPTY: 'not available',
  PROVIDER_NAME: 'Provider name not available',
  SHIPPED_ON_EMPTY: 'Date not available',
  IMAGE_EMPTY: 'Image not available',
  MEDICATION_DESCRIPTION_EMPTY: 'No description available',
  PHARMACY_PHONE_NUMBER_EMPTY: 'Pharmacy phone number not available',
  REASON_FOR_USE_EMPTY: 'Reason for use not available',
  INSTRUCTIONS_EMPTY: 'Instructions not available',
};
export const Paths = {
  LANDING_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  MED_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=10&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  EMPTY_MED_LIST:
    '/my_health/v1/prescriptions?&filter[[disp_status][eq]]=Active:%20Refill%20in%20Process,Active:%20Submitted&sort[]=prescription_name&sort[]=dispensed_date',
  DELAY_ALERT:
    '/my_health/v1/prescriptions?&filter[[disp_status][eq]]=Active:%20Refill%20in%20Process,Active:%20Submitted&sort[]=prescription_name&sort[]=dispensed_date',
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
