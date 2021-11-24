import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { createForm, getTokenFromLocation } from '../../utils/navigation';
import { createInitFormAction } from '../../actions';
import { createAnalyticsSlug } from '../../../utils/analytics';
import { isUUID } from '../../../utils/token-format-validator';

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
  const { router } = props;
  const { goToErrorPage } = useFormRouting(router);
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
              // TODO: dispath to redux
              const pages = createForm({ hasConfirmedDemographics: false });
              const firstPage = pages[0];
              initForm(pages, firstPage);
              // router.push(firstPage);
            }
          })
          .catch(() => {
            clearCurrentSession(window);
            goToErrorPage();
          });
      }
    },
    [initForm, router, goToErrorPage, clearCurrentSession, setCurrentToken],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
}
