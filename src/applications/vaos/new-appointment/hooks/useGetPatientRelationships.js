import { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FETCH_STATUS } from '../../utils/constants';
import { useOHDirectScheduling } from './useOHDirectScheduling';
import { getPatientProviderRelationships } from '../redux/selectors';
import { fetchPatientProviderRelationships } from '../redux/actions';

export function useGetPatientRelationships() {
  const dispatch = useDispatch();
  const featureOHDirectSchedule = useOHDirectScheduling();

  const {
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  } = useSelector(
    state => getPatientProviderRelationships(state),
    shallowEqual,
  );

  useEffect(
    () => {
      if (
        featureOHDirectSchedule &&
        !patientProviderRelationships.length &&
        patientProviderRelationshipsStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(fetchPatientProviderRelationships());
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
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  };
}
