import {
  getPrescriptionsList,
  getPrescriptionById,
} from '../api/prescriptionsApi';
import useMedicationPreferences from './useMedicationPreferences';

/**
 * Custom hook to fetch data for a single prescription from the cache if available,
 * and fall back to the API if not.
 *
 * @param {string|number} prescriptionId - The ID of the prescription to fetch
 * @returns {Object} - Object containing prescription data, error, and loading state
 */
const usePrescriptionData = prescriptionId => {
  const [queryParams] = useMedicationPreferences();

  // Check if the prescription data is already available in RTK's query cache
  const cachedPrescription = getPrescriptionsList.useQueryState(queryParams, {
    selectFromResult: ({ data: prescriptionsList }) => {
      return prescriptionsList?.prescriptions?.find(
        item => item.prescriptionId === Number(prescriptionId),
      );
    },
  });

  let prescription;
  let prescriptionApiError = false;
  let prescriptionIsLoading = false;

  if (cachedPrescription?.prescriptionId) {
    prescription = cachedPrescription;
  } else {
    const { data, error, isLoading } = getPrescriptionById.useQuery(
      prescriptionId,
    );
    prescription = data;
    prescriptionApiError = error;
    prescriptionIsLoading = isLoading;
  }

  return {
    prescription,
    error: prescriptionApiError,
    isLoading: prescriptionIsLoading,
  };
};

export default usePrescriptionData;
