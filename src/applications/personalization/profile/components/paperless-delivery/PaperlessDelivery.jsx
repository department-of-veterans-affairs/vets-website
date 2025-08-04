import React, { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { PROFILE_PATH_NAMES } from '@@profile/constants';
import { fetchCommunicationPreferenceGroups } from '@@profile/ducks/communicationPreferences';
import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
} from '~/platform/user/selectors';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectCommunicationPreferences } from '@@profile/reducers';
import Headline from '../ProfileSectionHeadline';
import { FieldHasBeenUpdated } from '../alerts/FieldHasBeenUpdated';
import { LOADING_STATES } from '../../../common/constants';
import { Description } from './Description';
import { Note } from './Note';
import { MissingEmailAlert } from './MissingEmailAlert';
import { ProfileEmail } from './ProfileEmail';
import { Documents } from './Documents';

export const PaperlessDelivery = () => {
  const dispatch = useDispatch();
  const emailAddress = useSelector(selectVAPEmailAddress);
  const facilities = useSelector(selectPatientFacilities, shallowEqual);
  const communicationPreferencesState = useSelector(
    selectCommunicationPreferences,
  );
  const hasVAPServiceError = useSelector(hasVAPServiceConnectionError); // rename?
  const hasLoadingError = Boolean(communicationPreferencesState.loadingErrors); // rename
  const shouldShowAPIError = hasVAPServiceError || hasLoadingError; // rename
  const shouldShowLoadingIndicator =
    communicationPreferencesState.loadingStatus === LOADING_STATES.pending;

  const shouldFetchNotificationSettings = !shouldShowAPIError;

  useEffect(
    () => {
      if (shouldFetchNotificationSettings) {
        dispatch(
          fetchCommunicationPreferenceGroups({
            facilities,
          }),
        );
      }
    },
    [dispatch, facilities, shouldFetchNotificationSettings],
  );

  const showMissingEmailAlert = !emailAddress;

  const shouldShowNotificationGroups = useMemo(
    () => {
      return !shouldShowAPIError && !shouldShowLoadingIndicator;
    },
    [shouldShowAPIError, shouldShowLoadingIndicator],
  );

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      {shouldShowLoadingIndicator && (
        <VaLoadingIndicator
          data-testid="loading-indicator"
          message="We’re loading your information."
        />
      )}
      {shouldShowNotificationGroups && (
        <>
          <Description />
          {showMissingEmailAlert && <MissingEmailAlert />}
          <FieldHasBeenUpdated slim />
          <ProfileEmail emailAddress={emailAddress} />
          <hr aria-hidden="true" className="vads-u-margin-y--3" />
          <Documents />
          <Note />
        </>
      )}
    </>
  );
};
