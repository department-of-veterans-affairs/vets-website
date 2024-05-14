import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPersonalInfo } from '../actions';

export const useData = () => {
  // This custom hook is for fetching and preparing user data from the Redux state.
  const dispatch = useDispatch();
  const { personalInfo, isLoading } = useSelector(state => state.personalInfo);

  useEffect(
    () => {
      dispatch(fetchPersonalInfo());
    },
    [dispatch],
  );
  const userInfo = personalInfo && personalInfo['vye::UserInfo'];

  return {
    loading: isLoading,
    ...userInfo,
  };
};
