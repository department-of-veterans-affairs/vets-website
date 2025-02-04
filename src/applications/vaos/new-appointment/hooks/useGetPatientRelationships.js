import { useEffect, useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FETCH_STATUS } from '../../utils/constants';
import { useOHDirectScheduling } from './useOHDirectScheduling';
import { getPatientRelationships } from '../redux/actions';
import { selectPatientProviderRelationships } from '../redux/selectors';

export function useGetPatientRelationships() {
  // const [loading, setLoading] = useState(true);
  const [loading] = useState(true);

  const dispatch = useDispatch();
  const featureOHDirectSchedule = useOHDirectScheduling();

  const {
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  } = useSelector(
    state => selectPatientProviderRelationships(state),
    shallowEqual,
  );

  useEffect(
    () => {
      // if (
      //   featureOHDirectSchedule &&
      //   !patientProviderRelationships.length &&
      //   patientProviderRelationshipsStatus === FETCH_STATUS.notStarted
      // ) {
      if (
        featureOHDirectSchedule &&
        patientProviderRelationshipsStatus === FETCH_STATUS.notStarted
      ) {
        dispatch(getPatientRelationships());
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
    patientProviderRelationships,
    patientProviderRelationshipsStatus,
  };
}
