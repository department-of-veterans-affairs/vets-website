export const Actions = {
  Breadcrumbs: {
    SET_BREAD_CRUMBS: 'SM_SET_BREAD_CRUMBS',
  },
  Prescriptions: {
    GET: 'RX_PRESCRIPTIONS_GET',
    GET_LIST: 'RX_PRESCRIPTIONS_GET_LIST',
    SET_SORTED_LIST: 'RX_PRESCRIPTIONS_SET_SORTED_LIST',
    CLEAR_ERROR: 'RX_PRESCRIPTIONS_CLEAR_ERROR',
    FILL: 'RX_PRESCRIPTIONS_FILL',
    FILL_ERROR: 'RX_PRESCRIPTIONS_FILL_ERROR',
  },
  // TODO: consider re-using this from medical-records
  Allergies: {
    GET_LIST: 'RX_ALLERGIES_GET_LIST',
  },
};
