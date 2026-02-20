import { defer } from 'react-router-dom-v5-compat';
import { store } from '../store';
import {
  getPrescriptionById,
  getPrescriptionsList,
  getRefillablePrescriptions,
} from '../api/prescriptionsApi';
import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
  STATION_NUMBER_PARAM,
} from '../util/constants';
import { getFilterOptions } from '../util/helpers/getRxStatus';
import {
  selectCernerPilotFlag,
  selectV2StatusMappingFlag,
} from '../util/selectors';

/**
 * Builds query parameters for prescription list requests
 * NOTE: This loader is not currently in use — the prescriptions list is fetched
 * by the useFetchPrescriptionsList hook and Prescriptions container. This loader
 * exists for future route-based data loading. Keeping it aligned with the
 * feature-flag-aware getFilterOptions for reference, but it should be enabled once
 * we do not have to dynamically select between V1 and V2 routes.
 * @param {Object} preferences - The rx preferences from the store
 * @param {Object} currentFilterOptions - Feature-flag-aware filter options
 * @returns {Object} Query parameters object
 */
const buildQueryParams = (preferences, currentFilterOptions) => {
  const { pageNumber, filterOption, sortOption } = preferences;

  // Get the sort endpoint from the sort option
  const sortEndpoint =
    sortOption && rxListSortingOptions[sortOption]?.API_ENDPOINT
      ? rxListSortingOptions[sortOption].API_ENDPOINT
      : rxListSortingOptions[Object.keys(rxListSortingOptions)[0]].API_ENDPOINT;

  // Determine filter option URL using feature-flag-aware filter options
  const filterOptionUrl =
    filterOption !== ALL_MEDICATIONS_FILTER_KEY &&
    currentFilterOptions[filterOption]?.url
      ? currentFilterOptions[filterOption].url
      : '';

  return {
    page: pageNumber || 1,
    perPage: 10,
    sortEndpoint,
    filterOption: filterOptionUrl,
  };
};

/**
 * Route loader for prescriptions
 * Loads prescription data when routes that need it are accessed
 *
 * N.B.: The order of the fetch promises is important, because
 *       browsers will only make 6-8 concurrent requests and the
 *       platform code is already fetching feature toggles,
 *       user profile, maintenance windows, etc.
 */
export const prescriptionsLoader = ({ params, request }) => {
  const fetchPromises = [];
  const rxId = params?.prescriptionId || null;

  // Extract station_number from URL query params
  const url = new URL(request.url);
  const stationNumber = url.searchParams.get(STATION_NUMBER_PARAM);

  const state = store.getState();

  // For refill pages, load refillable prescriptions
  if (window.location.pathname.endsWith('/refill')) {
    fetchPromises.push(store.dispatch(getRefillablePrescriptions.initiate()));
  } else if (!rxId) {
    const isCernerPilot = selectCernerPilotFlag(state);
    const isV2StatusMapping = selectV2StatusMappingFlag(state);
    const currentFilterOptions = getFilterOptions(
      isCernerPilot,
      isV2StatusMapping,
    );
    const prefs = buildQueryParams(state.rx.preferences, currentFilterOptions);
    fetchPromises.push(store.dispatch(getPrescriptionsList.initiate(prefs)));
  } else if (rxId) {
    // Fetch that specific prescription
    // station_number is passed when available (required for v2 API)
    fetchPromises.push(
      store.dispatch(getPrescriptionById.initiate({ id: rxId, stationNumber })),
    );
  }

  return defer(Promise.all(fetchPromises));
};
