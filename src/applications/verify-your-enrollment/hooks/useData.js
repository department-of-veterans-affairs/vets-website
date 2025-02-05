import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
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
  const profile = useSelector(selectProfile);
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(TOGGLE_NAMES.isDGIBEndpoint);
  useEffect(
    () => {
      const fetchData = async () => {
        if (toggleValue) {
          await dispatch(fetchClaimantId());
        }
        await dispatch(fetchPersonalInfo());
      };
      fetchData();
    },
    [dispatch, toggleValue],
  );

  const userInfo = response?.personalInfo?.['vye::UserInfo'];
  const expirationDate = translateDateIntoMonthDayYearFormat(
    userInfo?.delDate || response?.personalInfo?.recordResponse?.delimitingDate,
  );
  const remainingEntitlement =
    response?.personalInfo?.recordResponse?.enrollmentVerifications[0]
      ?.remainingEntitlement;
  const enrollmentVerifications =
    response?.personalInfo?.recordResponse?.enrollmentVerifications;
  const verifiedThroughDate =
    response?.personalInfo?.recordResponse?.verifiedDetails[0]
      .verifiedThroughDate;

  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(
    userInfo?.remEnt || remainingEntitlement,
  );
  const fullName = `${profile?.userFullName?.first} ${profile.userFullName
    ?.middle || ''} ${profile.userFullName?.last}`;
  const chapter = response?.personalInfo?.recordResponse?.verifiedDetails.at(-1)
    .benefitType;
  return {
    personalInfo: response?.personalInfo,
    errorMessage: response,
    loading: response?.isLoading || claimantIdResponse?.isLoading,
    expirationDate,
    updated,
    indicator: userInfo?.indicator || chapter,
    day,
    month,
    ...userInfo,
    claimantId: claimantIdResponse?.claimantId,
    profile,
    fullName,
    enrollmentVerifications,
    verifiedThroughDate,
  };
};
