import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { api } from '../../api';
import { useDispatch } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import {
  getTokenFromLocation,
  URLS,
  createForm,
} from '../../utils/navigation/day-of';
import { createInitFormAction } from '../../actions/navigation';
import { useFormRouting } from '../../hooks/useFormRouting';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { createAnalyticsSlug } from '../../utils/analytics';
import { isUUID, SCOPES } from '../../utils/token-format-validator';

import { createSetSession } from '../../actions/authentication';

const Landing = props => {
  const { isUpdatePageEnabled, location, router } = props;
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

  const setSession = useCallback(
    (token, permissions) => {
      dispatch(createSetSession({ token, permissions }));
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
          .getSession(token)
          .then(session => {
            if (session.errors || session.error) {
              clearCurrentSession(window);
              goToErrorPage();
            } else {
              // if session with read.full exists, go to check in page
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
      isUpdatePageEnabled,
      clearCurrentSession,
      setCurrentToken,
      jumpToPage,
      goToErrorPage,
      initForm,
      setSession,
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
};

export default Landing;
