import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { createForm, getTokenFromLocation, URLS } from '../../utils/navigation';
import { createInitFormAction, createSetSession } from '../../actions';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { isUUID, SCOPES } from '../../../utils/token-format-validator';

import recordEvent from 'platform/monitoring/record-event';
import { useFormRouting } from '../../hooks/useFormRouting';
import { useSessionStorage } from '../../hooks/useSessionStorage';

import { api } from '../../api';

export default function Index(props) {
  const [loadMessage] = useState('Finding your appointment information');

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

  const { router } = props;
  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const { clearCurrentSession, setCurrentToken } = useSessionStorage();
  useEffect(
    () => {
      const token = getTokenFromLocation(router.location);
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
      if (token && isUUID(token)) {
        // call the sessions api
        api.v2
          .getSession(token)
          .then(session => {
            // if successful, dispatch session data  into redux and current window
            if (session.error || session.errors) {
              clearCurrentSession(window);
              goToErrorPage();
            } else {
              setCurrentToken(window, token);
              const pages = createForm({ hasConfirmedDemographics: false });
              const firstPage = pages[0];
              initForm(pages, firstPage);
              setSession(token, session.permissions);
              if (session.permissions === SCOPES.READ_FULL) {
                // redirect if already full access
                jumpToPage(URLS.INTRODUCTION);
              } else {
                // TODO: dispatch to redux
                jumpToPage(URLS.VERIFY);
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
      initForm,
      router,
      goToErrorPage,
      clearCurrentSession,
      setCurrentToken,
      setSession,
      jumpToPage,
    ],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
}
