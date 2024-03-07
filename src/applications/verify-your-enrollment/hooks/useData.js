import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentDateFormatted,
  remainingBenefits,
  translateDateIntoMonthDayYearFormat,
} from '../helpers';
import { fetchPersonalInfo, getData } from '../actions';

export const useData = () => {
  // This custom hook is for fetching and preparing user data from the Redux state.
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.getDataReducer);
  const { personalInfo, isLoading } = useSelector(state => state.personalInfo);

  useEffect(
    () => {
      dispatch(getData());
      dispatch(fetchPersonalInfo());
    },
    [dispatch],
  );
  const isUserLoggedIn = localStorage.getItem('hasSession') !== null;

  const userInfo = isUserLoggedIn
    ? personalInfo && personalInfo['vye::UserInfo']
    : data && data['vye::UserInfo'];
  const expirationDate = translateDateIntoMonthDayYearFormat(userInfo?.delDate);
  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(userInfo?.remEnt);
  return {
    loading: loading || isLoading,
    expirationDate,
    updated,
    day,
    month,
    ...userInfo,
  };
};
