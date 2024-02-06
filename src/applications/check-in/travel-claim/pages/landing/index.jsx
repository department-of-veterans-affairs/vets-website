import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import propTypes from 'prop-types';

import { useTranslation } from 'react-i18next';

import { api } from '../../../api';

import { createInitFormAction } from '../../../actions/navigation';
import { createSetSession } from '../../../actions/authentication';

import { useStorage } from '../../../hooks/useStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useUpdateError } from '../../../hooks/useUpdateError';

import {
  createForm,
  getTokenFromLocation,
} from '../../../utils/navigation/pre-check-in';

import { URLS } from '../../../utils/navigation';
import { isUUID, SCOPES } from '../../../utils/token-format-validator';
import { APP_NAMES } from '../../../utils/appConstants';

const Landing = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { jumpToPage } = useFormRouting(router);
  const {
    clearCurrentStorage,
    setPreCheckinComplete,
    setCurrentToken,
  } = useStorage();

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

  const { updateError } = useUpdateError();

  useEffect(
    () => {
      const token = getTokenFromLocation(router.location);
      if (!token) {
        updateError('no-token');
      } else if (!isUUID(token)) {
        updateError('bad-token');
      }

      if (token && isUUID(token)) {
        // call the sessions api
        const checkInType = APP_NAMES.PRE_CHECK_IN;

        if (token && !sessionCallMade) {
          setSessionCallMade(true);
          api.v2
            .getSession({ token, checkInType })
            .then(session => {
              // if successful, dispatch session data  into redux and current window

              if (session.error || session.errors) {
                clearCurrentStorage(window);
                updateError('session-error');
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
            .catch(e => {
              // @TODO move clear current session to hook or HOC
              clearCurrentStorage(window);
              if (e?.errors[0]?.status === '404') {
                updateError('uuid-not-found');
              } else {
                updateError('session-error');
              }
            });
        }
      }
    },
    [
      clearCurrentStorage,
      dispatch,
      initForm,
      jumpToPage,
      router,
      sessionCallMade,
      setCurrentToken,
      setPreCheckinComplete,
      setSession,
      updateError,
    ],
  );
  return (
    <div>
      <va-loading-indicator message={loadMessage} />
    </div>
  );
};

Landing.propTypes = {
  router: propTypes.object,
};

export default Landing;
