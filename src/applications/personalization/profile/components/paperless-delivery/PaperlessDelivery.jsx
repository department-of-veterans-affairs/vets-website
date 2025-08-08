import React, { useEffect } from 'react';
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
import { SecureStorage } from './SecureStorage';
import { Documents } from './Documents';

export const PaperlessDelivery = () => {
  const dispatch = useDispatch();
  const emailAddress = useSelector(selectVAPEmailAddress);
  const facilities = useSelector(selectPatientFacilities, shallowEqual);
  const communicationPreferencesState = useSelector(
    selectCommunicationPreferences,
  );
  const hasVAPServiceError = useSelector(hasVAPServiceConnectionError);
  const { loadingStatus, loadingErrors } = communicationPreferencesState;
  const hasLoadingError = Boolean(loadingErrors);
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
  }, []);

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      {isLoading && (
        <VaLoadingIndicator
          data-testid="loading-indicator"
          message="We’re loading your information."
        />
      )}
      {showContent && (
        <>
          <Description />
          <MissingEmailAlert emailAddress={emailAddress} />
          <FieldHasBeenUpdated slim />
          <ProfileEmail emailAddress={emailAddress} />
          <SecureStorage />
          <hr aria-hidden="true" className="vads-u-margin-y--3" />
          <Documents />
          <Note />
        </>
      )}
    </>
  );
};
