import { Actions } from '../util/actionTypes';
import {
  getPrescription,
  getPaginatedSortedList,
  getRefillablePrescriptionList,
  fillRx,
  fillRxs,
  getAllergies,
  getFilteredList,
  getRecentlyRequestedList,
  getTooltipsList,
  createTooltip,
  incrementTooltipCounter,
} from '../api/rxApi';
import { isRefillTakingLongerThanExpected } from '../util/helpers';

// **Remove once filter feature is developed and live.**
export const getPrescriptionsPaginatedSortedList = (
  pageNumber,
  sortEndpoint,
  perPage,
) => async dispatch => {
  try {
    const response = await getPaginatedSortedList(
      pageNumber,
      sortEndpoint,
      perPage,
    );
    dispatch({
      type: Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      response,
    });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

export const getPaginatedFilteredList = (
  pageNumber,
  filterOption,
  sortEndpoint,
  perPage,
) => async dispatch => {
  try {
    const response = await getFilteredList(
      pageNumber,
      filterOption,
      sortEndpoint,
      perPage,
    );
    dispatch({
      type: Actions.Prescriptions.GET_PAGINATED_FILTERED_LIST,
      response,
    });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

export const getRefillAlertList = () => async dispatch => {
  try {
    const recentlyRequestedList = await getRecentlyRequestedList();
    const response = recentlyRequestedList.data.reduce(
      (refillAlertList, { attributes: rx }) => {
        if (isRefillTakingLongerThanExpected(rx)) {
          refillAlertList.push(rx);
        }
        return refillAlertList;
      },
      [],
    );

    dispatch({
      type: Actions.Prescriptions.GET_REFILL_ALERT_LIST,
      response,
    });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

// TODO: consider re-using this action from medical-records
export const getAllergiesList = () => async dispatch => {
  try {
    const response = await getAllergies();
    dispatch({ type: Actions.Allergies.GET_LIST, response });
    return null;
  } catch (error) {
    dispatch({ type: Actions.Allergies.GET_LIST_ERROR });
    return error;
  }
};

export const clearAllergiesError = () => async dispatch => {
  dispatch({ type: Actions.Allergies.GET_LIST_ERROR_RESET });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  try {
    const response = await getPrescription(prescriptionId);
    const prescription = response.data.attributes;
    dispatch({ type: Actions.Prescriptions.GET_DETAILS, prescription });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

export const setPrescriptionDetails = prescription => async dispatch => {
  dispatch({ type: Actions.Prescriptions.SET_DETAILS, prescription });
};

export const getRefillablePrescriptionsList = () => async dispatch => {
  try {
    const response = await getRefillablePrescriptionList();
    dispatch({
      type: Actions.Prescriptions.GET_REFILLABLE_LIST,
      response,
    });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

export const fillPrescription = prescriptionId => async dispatch => {
  try {
    dispatch({ type: Actions.Prescriptions.CLEAR_ERROR, prescriptionId });
    const response = await fillRx(prescriptionId);
    response.id = prescriptionId;
    dispatch({ type: Actions.Prescriptions.FILL, response });
    return null;
  } catch (error) {
    const err = error;
    err.id = prescriptionId;
    dispatch({
      type: Actions.Prescriptions.FILL_ERROR,
      err,
    });
    return error;
  }
};

export const fillPrescriptions = prescriptions => async dispatch => {
  try {
    const response = await fillRxs(prescriptions.map(p => p.prescriptionId));
    response.prescriptions = prescriptions;
    dispatch({ type: Actions.Prescriptions.FILL_NOTIFICATION, response });
    return null;
  } catch (error) {
    dispatch({
      type: Actions.Prescriptions.GET_API_ERROR,
    });
    return error;
  }
};

export const clearFillNotification = () => async dispatch => {
  dispatch({ type: Actions.Prescriptions.CLEAR_FILL_NOTIFICATION });
};

export const getTooltips = () => async dispatch => {
  try {
    const response = await getTooltipsList();
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIPS,
      response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.GET_TOOLTIPS_ERROR,
    });
    return error;
  }
};

export const createNewTooltip = () => async dispatch => {
  try {
    const response = await createTooltip();
    dispatch({
      type: Actions.Tooltip.CREATE_TOOLTIP,
      response,
    });
    return response;
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.CREATE_TOOLTIP_ERROR,
    });
    return error;
  }
};

export const incrementTooltip = tooltipId => async dispatch => {
  try {
    await incrementTooltipCounter(tooltipId);
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.INCREMENT_TOOLTIP_COUNTER_ERROR,
      error,
    });
  }
};

export const updateTooltipVisibility = (
  tooltipId,
  hidden,
) => async dispatch => {
  try {
    await updateTooltipVisibility(tooltipId, hidden);
  } catch (error) {
    dispatch({
      type: Actions.Tooltip.UPDATE_TOOLTIP_VISIBILITY_ERROR,
      error,
    });
  }
};

export const hideTooltip = () => {
  return {
    type: Actions.Tooltip.HIDE_TOOLTIP,
  };
};
