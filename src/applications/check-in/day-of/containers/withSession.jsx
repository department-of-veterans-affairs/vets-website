import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../api';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { URLS } from '../../utils/navigation/day-of';
import { useFormRouting } from '../../hooks/useFormRouting';
import { triggerRefresh } from '../../actions/day-of';
import { SCOPES } from '../../utils/token-format-validator';
import { makeSelectCheckInData } from '../hooks/selectors';
import { createSetSession } from '../../actions/authentication';

const withSession = Component => {
  const Wrapped = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState();

    const { router } = props;

    const dispatch = useDispatch();

    const setTriggerRefresh = useCallback(
      () => {
        dispatch(triggerRefresh());
      },
      [dispatch],
    );

    const setSession = useCallback(
      (token, permissions) => {
        dispatch(createSetSession({ token, permissions }));
      },
      [dispatch],
    );
    const selectCheckInData = useMemo(makeSelectCheckInData, []);
    const checkInData = useSelector(selectCheckInData);
    const {
      clearCurrentSession,
      setCurrentToken,
      getCurrentToken,
    } = useSessionStorage(false);
    const { jumpToPage, goToErrorPage } = useFormRouting(router, URLS);
    const { context } = checkInData;

    useEffect(
      () => {
        const session = getCurrentToken(window);
        if (!context || !session) {
          goToErrorPage();
        } else {
          // check if appointments is empty or if a refresh is staged
          const { token } = session;
          if (Object.keys(context).length === 0 || !context.permissions) {
            // check for 'read.full permissions?
            setIsLoading(true);
            api.v2
              .getSession(token)
              .then(json => {
                if (json.errors || json.error) {
                  clearCurrentSession(window);
                  goToErrorPage();
                } else {
                  // if session with read.full exists, go to check in page
                  setCurrentToken(window, token);
                  setSession(token, session.permissions);
                  if (session.permissions === SCOPES.READ_FULL) {
                    jumpToPage(URLS.details, {
                      params: { url: { id: token } },
                    });
                  } else {
                    setTriggerRefresh();
                    jumpToPage(URLS.VALIDATION_NEEDED);
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
        router,
        context,
        getCurrentToken,
        clearCurrentSession,
        setCurrentToken,
        goToErrorPage,
        jumpToPage,
        setSession,
        setTriggerRefresh,
      ],
    );

    if (isLoading) {
      return (
        <>
          <va-loading-indicator message={'Finding your session'} />
        </>
      );
    } else {
      return (
        <>
          <Component {...props} isSessionLoading={isLoading} />
        </>
      );
    }
  };

  Wrapped.propTypes = {
    router: PropTypes.object,
    setAuthenticatedSession: PropTypes.func,
  };

  return Wrapped;
};

export default withSession;
