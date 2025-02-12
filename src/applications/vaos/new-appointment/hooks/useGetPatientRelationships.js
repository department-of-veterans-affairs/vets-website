import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FETCH_STATUS } from '../../utils/constants';
import { useOHDirectScheduling } from './useOHDirectScheduling';
import { getPatientRelationships } from '../redux/actions';
import {
  selectPatientProviderRelationships,
  getFacilityPageV2Info,
} from '../redux/selectors';

export function useGetPatientRelationships() {
  const [loading, setLoading] = useState(true);
  const [patientRelationshipsError, setPatientRelationshipsError] = useState(
    false,
  );
  const dispatch = useDispatch();
  const featureOHDirectSchedule = useOHDirectScheduling();

  const {
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  } = useSelector(
    state => selectPatientProviderRelationships(state),
    shallowEqual,
  );
  const { typeOfCare, selectedFacility } = useSelector(
    state => getFacilityPageV2Info(state),
    shallowEqual,
  );

  useEffect(
    () => {
      if (
        featureOHDirectSchedule &&
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

      if (patientProviderRelationshipsStatus === FETCH_STATUS.failed) {
        setPatientRelationshipsError(true);
      }
    },
    [
      dispatch,
      featureOHDirectSchedule,
      patientProviderRelationshipsStatus,
      patientProviderRelationships,
    ],
  );

  return {
    loading,
    patientRelationshipsError,
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
    typeOfCare,
    selectedFacility,
  };
}
