import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../api';
import { useDispatch, batch } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import {
  getTokenFromLocation,
  URLS,
  createForm,
} from '../../utils/navigation/day-of';
import { createInitFormAction } from '../../actions';
import { useFormRouting } from '../../hooks/useFormRouting';
import { tokenWasValidated, triggerRefresh } from '../actions';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { createAnalyticsSlug } from '../../utils/analytics';
import { isUUID, SCOPES } from '../../utils/token-format-validator';

const Landing = props => {
  const {
    isUpdatePageEnabled,
    location,
    router,
    isEmergencyContactEnabled,
  } = props;
  const { jumpToPage, goToErrorPage } = useFormRouting(router, URLS);

  const [loadMessage] = useState('Finding your appointment information');
  const { clearCurrentSession, setCurrentToken } = useSessionStorage(false);
  const dispatch = useDispatch();

  const initForm = useCallback(
    (pages, firstPage) => {
      dispatch(createInitFormAction({ pages, firstPage }));
    },
    [dispatch],
  );
  const setAppointment = useCallback(
    (data, token) =>
      dispatch(tokenWasValidated(data, token, SCOPES.READ_BASIC)),
    [dispatch],
  );

  const setToken = useCallback(
    token => {
      batch(() => {
        dispatch(tokenWasValidated(undefined, token, SCOPES.READ_BASIC));
        dispatch(triggerRefresh());
      });
    },
    [dispatch],
  );

  const setAuthenticatedSession = useCallback(
    token => dispatch(tokenWasValidated(undefined, token, SCOPES.READ_FULL)),
    [dispatch],
  );

  useEffect(
    () => {
      const token = getTokenFromLocation(location);
      if (!token) {
        recordEvent({
          event: createAnalyticsSlug('landing-page-launched-no-token'),
        });
        goToErrorPage();
      }

      if (!isUUID(token)) {
        recordEvent({
          event: createAnalyticsSlug('malformed-token'),
        });
        goToErrorPage();
      }

      if (token) {
        api.v2
          .getSession(token)
          .then(session => {
            if (session.errors || session.error) {
              clearCurrentSession(window);
              goToErrorPage();
            } else {
              // if session with read.full exists, go to check in page
              setCurrentToken(window, token);
              const pages = createForm({
                hasConfirmedDemographics: false,
                isEmergencyContactEnabled,
              });
              const firstPage = pages[0];
              initForm(pages, firstPage);
              if (session.permissions === SCOPES.READ_FULL) {
                setAuthenticatedSession(token);
                jumpToPage(URLS.DETAILS);
              } else {
                setToken(token);
                jumpToPage(URLS.VALIDATION_NEEDED);
              }
            }
          })
          .catch(() => {
            clearCurrentSession(window);
            goToErrorPage();
          });
      }
    },
    [
      location,
      setAppointment,
      setToken,
      isUpdatePageEnabled,
      setAuthenticatedSession,
      clearCurrentSession,
      setCurrentToken,
      jumpToPage,
      goToErrorPage,
      initForm,
      isEmergencyContactEnabled,
    ],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
};

Landing.propTypes = {
  isUpdatePageEnabled: PropTypes.bool,
  location: PropTypes.object,
  router: PropTypes.object,
  isEmergencyContactEnabled: PropTypes.bool,
};

export default Landing;
