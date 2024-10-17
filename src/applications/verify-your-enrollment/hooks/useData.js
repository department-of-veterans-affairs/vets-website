import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentDateFormatted,
  remainingBenefits,
  translateDateIntoMonthDayYearFormat,
} from '../helpers';
import { fetchClaimantId, fetchPersonalInfo } from '../actions';

export const useData = () => {
  // This custom hook is for fetching and preparing user data from the Redux state.
  const dispatch = useDispatch();
  const response = useSelector(state => state.personalInfo);
  const claimantIdResponse = useSelector(state => state.checkClaimant);

  useEffect(
    () => {
      const fetchData = async () => {
        await dispatch(fetchClaimantId());
        await dispatch(fetchPersonalInfo());
      };
      fetchData();
    },
    [dispatch],
  );

  const userInfo = response?.personalInfo?.['vye::UserInfo'];
  const expirationDate = translateDateIntoMonthDayYearFormat(
    userInfo?.delDate || response?.personalInfo?.recordResponse?.delimitingDate,
  );
  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(userInfo?.remEnt);
  const fullName = `${claimantIdResponse.profile?.firstName} ${
    claimantIdResponse.profile?.middleName
  } ${claimantIdResponse.profile?.lastName}`;
  return {
    personalInfo: response?.personalInfo,
    errorMessage: response,
    loading: response?.isLoading,
    expirationDate,
    updated,
    day,
    month,
    ...userInfo,
    claimantId: claimantIdResponse?.claimantId,
    profile: claimantIdResponse?.profile,
    fullName,
  };
};
