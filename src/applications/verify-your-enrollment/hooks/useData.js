import { useEffect } from 'react';
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
  const userInfo = data && data['vye::UserInfo'];
  const date = translateDateIntoMonthDayYearFormat(userInfo?.delDate);
  return {
    loading,
    date,
    enrollmentData: userInfo,
    personalInfo,
    ...userInfo,
  };
};
