import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  hasVAPServiceConnectionError,
  selectVAPEmailAddress,
} from '~/platform/user/selectors';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
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
  const isLoading = loadingStatus === LOADING_STATES.pending;
  const hasAPIError = hasVAPServiceError || hasLoadingError;
  const showContent = !hasAPIError && !isLoading;

  useEffect(() => {
    document.title = `Paperless Delivery | Veterans Affairs`;
    focusElement('[data-focus-target]');
  }, []);

  useEffect(
    () => {
      if (!hasAPIError) {
        dispatch(
          fetchCommunicationPreferenceGroups({
            facilities,
          }),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, hasAPIError],
  );

  return (
    <>
      <Headline>{PROFILE_PATH_NAMES.PAPERLESS_DELIVERY}</Headline>
      <DowntimeNotification
        appTitle="paperless delivery page"
        dependencies={[externalServices.VAPRO_NOTIFICATION_SETTINGS]}
      >
        {isLoading && (
          <VaLoadingIndicator message="We're loading your information." />
        )}
        {hasAPIError && <ApiErrorAlert />}
        {showContent && (
          <>
            <Description />
            <MissingEmailAlert emailAddress={emailAddress} />
            <FieldHasBeenUpdated slim />
            <ProfileEmail emailAddress={emailAddress} />
            <hr
              aria-hidden="true"
              className="vads-u-margin-y--3 vads-u-border-top--0"
            />
            <Documents />
            <Note />
          </>
        )}
      </DowntimeNotification>
    </>
  );
};
