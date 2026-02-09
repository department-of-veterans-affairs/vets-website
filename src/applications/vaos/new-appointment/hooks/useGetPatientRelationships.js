import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FETCH_STATUS } from '../../utils/constants';
import { useOHScheduling } from './useOHScheduling';
import { getPatientRelationships } from '../redux/actions';
import { selectPatientProviderRelationships } from '../redux/selectors';

export function useGetPatientRelationships({ skip = false } = {}) {
  const [loading, setLoading] = useState(!skip);
  const [patientRelationshipsError, setPatientRelationshipsError] = useState(
    false,
  );
  const dispatch = useDispatch();
  const featureOHScheduling = useOHScheduling();

  // Fetches patient relationships
  const {
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
    backendServiceFailures,
  } = useSelector(
    state => selectPatientProviderRelationships(state),
    shallowEqual,
  );

  const hasBackendServiceFailures = backendServiceFailures?.length > 0;

  useEffect(
    () => {
      if (skip) {
        setLoading(false);
        return;
      }

      if (
        featureOHScheduling &&
        patientProviderRelationshipsStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(getPatientRelationships());
      }

      if (
        patientProviderRelationshipsStatus === FETCH_STATUS.succeeded ||
        patientProviderRelationshipsStatus === FETCH_STATUS.failed
      ) {
        setLoading(false);
      }

      if (
        patientProviderRelationshipsStatus === FETCH_STATUS.failed ||
        hasBackendServiceFailures
      ) {
        setPatientRelationshipsError(true);
      }
    },
    [
      dispatch,
      featureOHScheduling,
      patientProviderRelationshipsStatus,
      patientProviderRelationships,
      hasBackendServiceFailures,
      skip,
    ],
  );

  return {
    loading,
    patientRelationshipsError,
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  };
}
