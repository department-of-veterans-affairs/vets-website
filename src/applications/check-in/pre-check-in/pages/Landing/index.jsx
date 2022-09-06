import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { api } from '../../../api';

import { createInitFormAction } from '../../../actions/navigation';
import { createSetSession } from '../../../actions/authentication';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';
import {
  createForm,
  getTokenFromLocation,
} from '../../../utils/navigation/pre-check-in';

import { URLS } from '../../../utils/navigation';
import { isUUID, SCOPES } from '../../../utils/token-format-validator';
import { setApp } from '../../../actions/universal';
import { APP_NAMES } from '../../../utils/appConstants';

const Index = props => {
  const { router } = props;
  const { t } = useTranslation();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isLorotaSecurityUpdatesEnabled } = useSelector(selectFeatureToggles);

  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const {
    clearCurrentSession,
    setPreCheckinComplete,
    setCurrentToken,
  } = useSessionStorage();

  const [loadMessage] = useState(t('finding-your-appointment-information'));
  const [sessionCallMade, setSessionCallMade] = useState(false);

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
      dispatch(setApp(APP_NAMES.PRE_CHECK_IN));
    },
    [dispatch],
  );

  useEffect(
    () => {
      const token = getTokenFromLocation(router.location);
      if (!token) {
        goToErrorPage('?error=no-token');
      }

      if (!isUUID(token)) {
        goToErrorPage('?error=bad-token');
      }
      if (token && isUUID(token)) {
        // call the sessions api
        const checkInType = APP_NAMES.PRE_CHECK_IN;

        if (token && !sessionCallMade) {
          setSessionCallMade(true);
          api.v2
            .getSession({ token, checkInType, isLorotaSecurityUpdatesEnabled })
            .then(session => {
              // if successful, dispatch session data  into redux and current window

              if (session.error || session.errors) {
                clearCurrentSession(window);
                goToErrorPage('?error=session-error');
              } else {
                setCurrentToken(window, token);
                setPreCheckinComplete(window, false);
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
      }
    },
    [
      clearCurrentSession,
      goToErrorPage,
      initForm,
      isLorotaSecurityUpdatesEnabled,
      jumpToPage,
      router,
      sessionCallMade,
      setCurrentToken,
      setPreCheckinComplete,
      setSession,
    ],
  );
  return (
    <>
      <va-loading-indicator message={loadMessage} />
    </>
  );
};

Index.propTypes = {
  router: propTypes.object,
};

export default Index;
