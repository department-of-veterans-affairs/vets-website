import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { translateDateIntoMonthDayYearFormat } from '../helpers';
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
  const date = translateDateIntoMonthDayYearFormat(userInfo?.delDate);
  return {
    loading: loading || isLoading,
    date,
    ...userInfo,
  };
};
