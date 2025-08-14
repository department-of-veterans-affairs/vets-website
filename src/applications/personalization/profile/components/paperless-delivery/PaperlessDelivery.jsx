import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
} from '~/platform/user/selectors';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { selectCommunicationPreferences } from '@@profile/reducers';
import { fetchCommunicationPreferenceGroups } from '@@profile/ducks/communicationPreferences';
import { focusElement } from '~/platform/utilities/ui';
import { PROFILE_PATH_NAMES } from '@@profile/constants';
import { LOADING_STATES } from '~/applications/personalization/common/constants';
import Headline from '../ProfileSectionHeadline';
import { FieldHasBeenUpdated } from '../alerts/FieldHasBeenUpdated';
import { Description } from './Description';
import { MissingEmailAlert } from './MissingEmailAlert';
import { ProfileEmail } from './ProfileEmail';
import { SecureStorage } from './SecureStorage';
import { Documents } from './Documents';
import { Note } from './Note';
import { ApiErrorAlert } from './ApiErrorAlert';

export const PaperlessDelivery = () => {
  const dispatch = useDispatch();
  const emailAddress = useSelector(selectVAPEmailAddress);
  const facilities = useSelector(selectPatientFacilities, shallowEqual);
  const communicationPreferencesState = useSelector(
    selectCommunicationPreferences,
  );
  const hasVAPServiceError = useSelector(hasVAPServiceConnectionError);
  const { loadingStatus } = communicationPreferencesState;
  const hasLoadingError = loadingStatus === LOADING_STATES.error;
  const hasAPIError = hasVAPServiceError || hasLoadingError;
  const isLoading =
    loadingStatus === LOADING_STATES.idle ||
    loadingStatus === LOADING_STATES.pending;
  const fetchCommunicationPreferences =
    !hasAPIError && loadingStatus === LOADING_STATES.idle;
  const showContent = !hasAPIError && !isLoading;

  useEffect(
    () => {
      if (fetchCommunicationPreferences) {
        dispatch(
          fetchCommunicationPreferenceGroups({
            facilities,
          }),
        );
      }
    },
    [dispatch, facilities, fetchCommunicationPreferences],
  );

  useEffect(() => {
    document.title = `Paperless Delivery | Veterans Affairs`;
    focusElement('[data-focus-target]');
  }, []);

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      {isLoading && (
        <VaLoadingIndicator message="We’re loading your information." />
      )}
      {hasAPIError && <ApiErrorAlert />}
      {showContent && (
        <>
          <Description />
          <MissingEmailAlert emailAddress={emailAddress} />
          <FieldHasBeenUpdated slim />
          <ProfileEmail emailAddress={emailAddress} />
          <SecureStorage />
          <Documents />
          <Note />
        </>
      )}
    </>
  );
};
