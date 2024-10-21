import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
      .remainingEntitlement;
  const enrollmentVerifications =
    response?.personalInfo?.recordResponse?.enrollmentVerifications;
  const updated = getCurrentDateFormatted(userInfo?.dateLastCertified);
  const { month, day } = remainingBenefits(
    userInfo?.remEnt || remainingEntitlement,
  );
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
    enrollmentVerifications,
  };
};
