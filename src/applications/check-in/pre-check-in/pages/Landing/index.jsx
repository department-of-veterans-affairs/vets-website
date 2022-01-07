import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import recordEvent from 'platform/monitoring/record-event';

import { api } from '../../../api';

import { createInitFormAction } from '../../../actions/navigation';
import { createSetSession } from '../../../actions/pre-check-in';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';

import { createAnalyticsSlug } from '../../../utils/analytics';
import {
  createForm,
  getTokenFromLocation,
  URLS,
} from '../../../utils/navigation/pre-check-in';
import { isUUID, SCOPES } from '../../../utils/token-format-validator';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

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
  const { goToErrorPage, jumpToPage } = useFormRouting(router, URLS);
  const { clearCurrentSession, setCurrentToken } = useSessionStorage();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isEmergencyContactEnabled } = useSelector(selectFeatureToggles);

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
              const pages = createForm();
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
      clearCurrentSession,
      goToErrorPage,
      initForm,
      isEmergencyContactEnabled,
      jumpToPage,
      router,
      setCurrentToken,
      setSession,
    ],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
}
