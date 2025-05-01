import { store } from '../store';
import {
  getPrescriptionById,
  getPrescriptionsList,
  getRefillablePrescriptions,
  getRefillAlertPrescriptions,
} from '../api/prescriptionsApi';
import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  filterOptions,
} from '../util/constants';

/**
 * Route loader for prescriptions
 * Loads prescription data when routes that need it are accessed
 * This follows the React Router loader pattern
 */
export const prescriptionsLoader = async ({ params }) => {
  const fetchPromises = [];

  // For main prescriptions list, load first page of prescriptions
  if (!params?.prescriptionId) {
    // Get values from Redux store
    const state = store.getState();
    const { pageNumber, filterOption, sortOption } = state.rx.preferences;

    // Get the sort endpoint from the sort option
    const sortEndpoint =
      sortOption && rxListSortingOptions[sortOption]?.API_ENDPOINT
        ? rxListSortingOptions[sortOption].API_ENDPOINT
        : rxListSortingOptions[Object.keys(rxListSortingOptions)[0]]
            .API_ENDPOINT;

    // Determine filter option URL
    const filterOptionUrl =
      filterOption !== ALL_MEDICATIONS_FILTER_KEY &&
      filterOptions[filterOption]?.url
        ? filterOptions[filterOption].url
        : '';

    const queryParams = {
      page: pageNumber || 1,
      perPage: 10,
      sortEndpoint,
      filterOption: filterOptionUrl,
    };

    fetchPromises.push(
      store.dispatch(getPrescriptionsList.initiate(queryParams)),
    );
    fetchPromises.push(store.dispatch(getRefillAlertPrescriptions.initiate()));
  }

  // If on a prescription detail page, also fetch that specific prescription
  if (params?.prescriptionId) {
    fetchPromises.push(
      store.dispatch(getPrescriptionById.initiate(params.prescriptionId)),
    );
  }

  // For refill pages, load refillable prescriptions
  if (window.location.pathname.endsWith('/refill')) {
    fetchPromises.push(
      store.dispatch(getRefillablePrescriptions.initiate(undefined)),
    );
  }

  // Wait for all fetch promises to resolve
  await Promise.all(fetchPromises);

  return null;
};
