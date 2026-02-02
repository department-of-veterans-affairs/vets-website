import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';
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
  const [searchParams] = useSearchParams();
  const stationNumber = searchParams.get('station_number');

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

  // Build query params for getPrescriptionById
  // Use stationNumber from URL if available, otherwise fall back to cached prescription's stationNumber
  const prescriptionByIdParams = {
    id: prescriptionId,
    stationNumber: stationNumber || cachedPrescription?.stationNumber,
  };

  // Fetch individual prescription when needed
  const { data, error, isLoading: queryLoading } = getPrescriptionById.useQuery(
    prescriptionByIdParams,
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
