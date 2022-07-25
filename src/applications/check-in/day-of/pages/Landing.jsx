import React, { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import recordEvent from 'platform/monitoring/record-event';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';
import { api } from '../../api';
import {
  getTokenFromLocation,
  createForm,
} from '../../utils/navigation/day-of';

import { URLS } from '../../utils/navigation';

import { createInitFormAction } from '../../actions/navigation';
import { useFormRouting } from '../../hooks/useFormRouting';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { createAnalyticsSlug } from '../../utils/analytics';
import { isUUID, SCOPES } from '../../utils/token-format-validator';

import { createSetSession } from '../../actions/authentication';
import { setApp } from '../../actions/universal';
import { APP_NAMES } from '../../utils/appConstants';

const Landing = props => {
  const { location, router } = props;
  const { jumpToPage, goToErrorPage } = useFormRouting(router);
  const { t } = useTranslation();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isLorotaSecurityUpdatesEnabled } = useSelector(selectFeatureToggles);

  const [loadMessage] = useState(t('finding-your-appointment-information'));
  const {
    clearCurrentSession,
    setShouldSendDemographicsFlags,
    setCurrentToken,
    resetAttempts,
  } = useSessionStorage(false);
  const dispatch = useDispatch();

  const initForm = useCallback(
    (pages, firstPage) => {
      dispatch(createInitFormAction({ pages, firstPage }));
    },
    [dispatch],
  );

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
    },
    [dispatch],
  );

  useEffect(
    () => {
      dispatch(setApp(APP_NAMES.CHECK_IN));
    },
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
          .getSession({
            token,
            isLorotaSecurityUpdatesEnabled,
          })
          .then(session => {
            if (session.errors || session.error) {
              clearCurrentSession(window);
              goToErrorPage();
            } else {
              // if session with read.full exists, go to check in page
              setShouldSendDemographicsFlags(window, true);
              setCurrentToken(window, token);
              const pages = createForm();
              const firstPage = pages[0];

              initForm(pages, firstPage);
              setSession(token, session.permissions);
              if (session.permissions === SCOPES.READ_FULL) {
                jumpToPage(URLS.LOADING);
              } else {
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
      clearCurrentSession,
      setCurrentToken,
      jumpToPage,
      goToErrorPage,
      initForm,
      setSession,
      setShouldSendDemographicsFlags,
      resetAttempts,
      isLorotaSecurityUpdatesEnabled,
    ],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
};

Landing.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
};

export default Landing;
