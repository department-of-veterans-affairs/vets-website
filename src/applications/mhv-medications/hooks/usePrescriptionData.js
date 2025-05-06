import {
  getPrescriptionsList,
  getPrescriptionById,
} from '../api/prescriptionsApi';

/**
 * Custom hook to fetch data for a single prescription from the cache if available,
 * and fall back to the API if not.
 *
 * @param {string|number} prescriptionId - The ID of the prescription to fetch
 * @param {Object} queryParams - Parameters for the prescription list query
 * @returns {Object} - Object containing prescription data, error, and loading state
 */
const usePrescriptionData = (prescriptionId, queryParams) => {
  // Check if the prescription data is already available in RTK's query cache
  const cachedPrescription = getPrescriptionsList.useQueryState(queryParams, {
    selectFromResult: ({ data: prescriptionsList }) => {
      return prescriptionsList?.prescriptions?.find(
        item => item.prescriptionId === Number(prescriptionId),
      );
    },
  });

  // If not found in cache, fetch it directly
  const {
    data: directPrescription,
    error: prescriptionApiError,
    isLoading: directFetchLoading,
  } = getPrescriptionById.useQuery(prescriptionId, {
    skip: Boolean(cachedPrescription?.prescriptionId),
  });

  // Determine which data source to use
  const prescription = cachedPrescription?.prescriptionId
    ? cachedPrescription
    : directPrescription;

  const error = prescriptionApiError || false;
  const isLoading = !prescription && (directFetchLoading || !error);

  return {
    prescription,
    error,
    isLoading,
  };
};

export default usePrescriptionData;
