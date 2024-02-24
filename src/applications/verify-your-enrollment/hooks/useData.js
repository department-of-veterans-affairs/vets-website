import { useEffect } from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useDispatch, useSelector } from 'react-redux';
import { translateDateIntoMonthDayYearFormat } from '../helpers';
import { fetchPersonalInfo, getData } from '../actions';

export const useData = () => {
  // This custom hook is for fetching and preparing user data from the Redux state.
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.getDataReducer);
  const { personalInfo } = useSelector(state => state.personalInfo);

  useEffect(
    () => {
      dispatch(getData());
      dispatch(fetchPersonalInfo());
    },
    [dispatch],
  );
  const userInfo =
    environment.API_URL === 'http://localhost:3000'
      ? data && data['vye::UserInfo']
      : personalInfo && personalInfo['vye::UserInfo'];
  const date = translateDateIntoMonthDayYearFormat(userInfo?.delDate);
  return {
    loading,
    date,
    ...userInfo,
  };
};
