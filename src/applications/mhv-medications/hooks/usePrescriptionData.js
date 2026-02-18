import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom-v5-compat';
import {
  getPrescriptionsList,
  getPrescriptionById,
} from '../api/prescriptionsApi';
import { STATION_NUMBER_PARAM } from '../util/constants';
import { selectCernerPilotFlag } from '../util/selectors';

/**
 * Custom hook to fetch prescription data
 * @param {string} prescriptionId - The ID of the prescription to fetch
 * @param {object} queryParams - Query parameters for fetching the prescription list
 * @returns {object} - The prescription data, loading state, and error state
 */
export const usePrescriptionData = (prescriptionId, queryParams) => {
  const [searchParams] = useSearchParams();
  const stationNumber = searchParams.get(STATION_NUMBER_PARAM);
  const isCernerPilot = useSelector(selectCernerPilotFlag);

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
  // Use stationNumber from URL if available (required for v2 API when Cerner pilot is enabled)
  // Only fall back to cached prescription's stationNumber when Cerner pilot is enabled
  const getStationNumber = () => {
    if (stationNumber) return stationNumber;
    if (isCernerPilot && cachedPrescription?.stationNumber) {
      return cachedPrescription.stationNumber;
    }
    return undefined;
  };

  const resolvedStationNumber = getStationNumber();

  // Skip API call if Cerner pilot is enabled but no station number is available from any source
  // This prevents failed API calls while waiting for redirect or cached data
  const shouldSkipDueToMissingStationNumber =
    isCernerPilot && !resolvedStationNumber && !cachedPrescriptionAvailable;

  const prescriptionByIdParams = {
    id: prescriptionId,
    stationNumber: resolvedStationNumber,
  };

  // Fetch individual prescription when needed
  const { data, error, isLoading: queryLoading } = getPrescriptionById.useQuery(
    prescriptionByIdParams,
    {
      skip: cachedPrescriptionAvailable || shouldSkipDueToMissingStationNumber,
    },
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
