import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentDateFormatted,
  remainingBenefits,
  translateDateIntoMonthDayYearFormat,
} from '../helpers';
import { fetchPersonalInfo } from '../actions';

export const useData = () => {
  // This custom hook is for fetching and preparing user data from the Redux state.
  const dispatch = useDispatch();
  const response = useSelector(state => state.personalInfo);
  const { data: enrollmentResponse } = useSelector(
    state => state.verifyEnrollment,
  );
  useEffect(
    () => {
      dispatch(fetchPersonalInfo());
    },
    [dispatch, enrollmentResponse],
  );

  const userInfo = response?.personalInfo?.['vye::UserInfo'];

  const expirationDate = translateDateIntoMonthDayYearFormat(userInfo?.delDate);
  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(userInfo?.remEnt);
  return {
    personalInfo: response?.personalInfo,
    errorMessage: response,
    loading: response?.isLoading,
    expirationDate,
    updated,
    day,
    month,
    ...userInfo,
  };
};
