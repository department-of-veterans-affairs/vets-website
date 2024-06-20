import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { api } from '../../api';
import {
  getTokenFromLocation,
  createForm,
} from '../../utils/navigation/day-of';

import { URLS } from '../../utils/navigation';
import { APP_NAMES } from '../../utils/appConstants';

import { createInitFormAction } from '../../actions/navigation';
import { useFormRouting } from '../../hooks/useFormRouting';
import { useStorage } from '../../hooks/useStorage';
import { useUpdateError } from '../../hooks/useUpdateError';
import { isUUID, SCOPES } from '../../utils/token-format-validator';

import { createSetSession } from '../../actions/authentication';

const Landing = props => {
  const { location, router } = props;
  const { jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();

  const { updateError } = useUpdateError();

  const [loadMessage] = useState(t('finding-your-appointment-information'));
  const [sessionCallMade, setSessionCallMade] = useState(false);

  const {
    clearCurrentStorage,
    setShouldSendDemographicsFlags,
    setShouldSendTravelPayClaim,
    setCurrentToken,
    setCheckinComplete,
  } = useStorage(APP_NAMES.CHECK_IN);
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

      setCheckinComplete(window, false);

      if (!token) {
        updateError('no-token');
      } else if (!isUUID(token)) {
        updateError('bad-token');
      }

      if (token && !sessionCallMade) {
        setSessionCallMade(true);
        api.v2
          .getSession({
            token,
          })
          .then(session => {
            if (session.errors || session.error) {
              clearCurrentStorage(window);
              updateError('session-error');
            } else {
              // if session with read.full exists, go to check in page
              setShouldSendDemographicsFlags(window, true);
              setShouldSendTravelPayClaim(window, true);
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
          .catch(e => {
            clearCurrentStorage(window);
            if (e.errors && e.errors[0]?.status === '404') {
              updateError('uuid-not-found');
            } else {
              updateError('error-fromlocation-landing');
            }
          });
      }
    },
    [
      location,
      clearCurrentStorage,
      setCurrentToken,
      jumpToPage,
      updateError,
      initForm,
      sessionCallMade,
      setSession,
      setShouldSendDemographicsFlags,
      setShouldSendTravelPayClaim,
      setCheckinComplete,
    ],
  );
  return (
    <div>
      <va-loading-indicator message={loadMessage} />
    </div>
  );
};

Landing.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
};

export default Landing;
