export const Data = {
  PAGINATION_TEXT: 'Showing 1 - 20 of 29 medications',
};
export const Paths = {
  LANDING_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  MED_LIST:
    '/my_health/v1/prescriptions?page=1&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  SORT_BY_NAME: '&sort[]=prescription_name&sort[]=dispensed_date',
  SORT_BY_LAST_FILLED: '&sort[]=-dispensed_date&sort[]=prescription_name',
  SORT_BY_STATUS:
    '&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
  INTERCEPT: {
    PAGINATION_NEXT:
      'my_health/v1/prescriptions?page=2&per_page=20&sort[]=disp_status&sort[]=prescription_name&sort[]=dispensed_date',
    ACTIVE_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Active,Active:%20Refill%20in%20Process,Active:%20Non-VA,Active:%20On%20hold,Active:%20Parked,Active:%20Refill%20in%20process,Active:%20Submitted',
    RECENTLY_REQUESTED_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Active:%20Refill%20in%20process,Active:%20Submitted',
    RENEW_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Active:%20Refill%20in%20process,Expired&filter[[is_refillable][eq]]=false',
    NON_VA_FILTER_LIST:
      '/my_health/v1/prescriptions?page=1&per_page=20&filter[[disp_status][eq]]=Discontinued,Expired,Transferred,Unknown',
  },
};
