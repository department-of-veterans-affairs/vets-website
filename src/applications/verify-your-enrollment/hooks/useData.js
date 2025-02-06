import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import { useLocation } from 'react-router-dom-v5-compat';
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
  const profile = useSelector(selectProfile);

  const location = useLocation();
  useEffect(
    () => {
      const fetchData = async () => {
        if (location.pathname === '/') {
          await dispatch(fetchPersonalInfo());
        }
      };
      fetchData();
    },
    [dispatch, location.pathname],
  );

  const userInfo = response?.personalInfo?.['vye::UserInfo'];
  const expirationDate = translateDateIntoMonthDayYearFormat(
    userInfo?.delDate ||
      response?.personalInfo?.verificationRecord?.delimitingDate,
  );
  const remainingEntitlement =
    response?.personalInfo?.verificationRecord?.enrollmentVerifications?.[0]
      ?.remainingEntitlement;
  const enrollmentVerifications =
    response?.personalInfo?.verificationRecord?.enrollmentVerifications;
  const verifiedThroughDate =
    response?.personalInfo?.verificationRecord?.verifiedDetails?.[0]
      .verifiedThroughDate;

  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(
    userInfo?.remEnt || remainingEntitlement,
  );
  const fullName = `${profile?.userFullName?.first} ${profile.userFullName
    ?.middle || ''} ${profile.userFullName?.last}`;
  const chapter = response?.personalInfo?.verificationRecord?.verifiedDetails?.at(
    -1,
  ).benefitType;
  const claimantLookup = response?.personalInfo?.claimantLookup?.claimantId;
  return {
    personalInfo: response?.personalInfo,
    errorMessage: response,
    loading: response?.isLoading,
    expirationDate,
    updated,
    indicator: userInfo?.indicator || chapter,
    day,
    month,
    ...userInfo,
    claimantId: claimantLookup,
    profile,
    fullName,
    enrollmentVerifications,
    verifiedThroughDate,
  };
};
