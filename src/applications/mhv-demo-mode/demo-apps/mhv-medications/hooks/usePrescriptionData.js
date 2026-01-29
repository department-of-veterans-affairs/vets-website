import { useEffect, useState } from 'react';
import {
  getPrescriptionsList,
  getPrescriptionById,
} from '../api/prescriptionsApi';

/**
 * Custom hook to fetch prescription data
 * @param {string} prescriptionId - The ID of the prescription to fetch
 * @param {object} queryParams - Query parameters for fetching the prescription list
 * @returns {object} - The prescription data, loading state, and error state
 */
export const usePrescriptionData = (prescriptionId, queryParams) => {
  const [
    cachedPrescriptionAvailable,
    setCachedPrescriptionAvailable,
  ] = useState(true);
  const [prescription, setPrescription] = useState(null);
  const [prescriptionApiError, setPrescriptionApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get cached prescription from list if available
  const cachedPrescription = getPrescriptionsList.useQueryState(queryParams, {
    selectFromResult: ({ data: prescriptionsList }) => {
      return prescriptionsList?.prescriptions?.find(
        item => String(item.prescriptionId) === String(prescriptionId),
      );
    },
  });

  // Fetch individual prescription when needed
  const { data, error, isLoading: queryLoading } = getPrescriptionById.useQuery(
    prescriptionId,
    { skip: cachedPrescriptionAvailable },
  );

  // Handle prescription data from either source
  useEffect(
    () => {
      if (cachedPrescriptionAvailable && cachedPrescription?.prescriptionId) {
        setPrescription(cachedPrescription);
        setIsLoading(false);
      } else if (!queryLoading) {
        if (error) {
          setCachedPrescriptionAvailable(false);
          setPrescriptionApiError(error);
          setIsLoading(false);
        } else if (data) {
          setPrescription(data);
          setIsLoading(false);
        }
      }
    },
    [
      cachedPrescription,
      data,
      error,
      queryLoading,
      cachedPrescriptionAvailable,
    ],
  );

  // Determine when to fetch individual prescription
  useEffect(
    () => {
      if (
        cachedPrescriptionAvailable &&
        !cachedPrescription?.prescriptionId &&
        !queryLoading
      ) {
        setCachedPrescriptionAvailable(false);
      }
    },
    [cachedPrescription, queryLoading, cachedPrescriptionAvailable],
  );

  return {
    prescription,
    prescriptionApiError,
    isLoading,
  };
};
