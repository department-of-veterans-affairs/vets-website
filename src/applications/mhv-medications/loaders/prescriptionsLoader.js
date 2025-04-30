import { store } from '../store';
import {
  getPrescriptionById,
  getPrescriptionsList,
  getRefillablePrescriptions,
  getRefillAlertPrescriptions,
} from '../api/prescriptionsApi';
import {
  defaultSelectedSortOption,
  rxListSortingOptions,
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
    const queryParams = {
      page: 1,
      perPage: 10,
      sortEndpoint:
        rxListSortingOptions[defaultSelectedSortOption].API_ENDPOINT,
      filterOption: '',
    };
    fetchPromises.push(
      store.dispatch(getPrescriptionsList.initiate(queryParams)).unwrap(),
    );
    fetchPromises.push(
      store.dispatch(getRefillAlertPrescriptions.initiate()).unwrap(),
    );
  }

  // If on a prescription detail page, also fetch that specific prescription
  if (params?.prescriptionId) {
    fetchPromises.push(
      store
        .dispatch(getPrescriptionById.initiate(params.prescriptionId))
        .unwrap(),
    );
  }

  // For refill pages, load refillable prescriptions
  // Using this workaround because React Router doesn't pass the route path to the loader.
  if (window.location.pathname.endsWith('/refill')) {
    fetchPromises.push(
      store.dispatch(getRefillablePrescriptions.initiate(undefined)).unwrap(),
    );
  }

  // Wait for all fetch promises to resolve
  await Promise.all(fetchPromises);

  return null;
};
