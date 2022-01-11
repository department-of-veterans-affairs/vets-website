import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, batch } from 'react-redux';
import { api } from '../../api';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { URLS } from '../../utils/navigation/day-of';
import { useFormRouting } from '../../hooks/useFormRouting';
import { triggerRefresh, tokenWasValidated } from '../../actions/day-of';
import { SCOPES } from '../../utils/token-format-validator';
import { makeSelectCheckInData } from '../hooks/selectors';

const withSession = Component => {
  const Wrapped = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState();

    const { router } = props;

    const dispatch = useDispatch();

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
          if (Object.keys(context).length === 0 || !context.scope) {
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
                  if (session.permissions === SCOPES.READ_FULL) {
                    setAuthenticatedSession(token);
                    jumpToPage(URLS.details, {
                      params: { url: { id: token } },
                    });
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
        }
      },
      [
        router,
        context,
        setAuthenticatedSession,
        setToken,
        getCurrentToken,
        clearCurrentSession,
        setCurrentToken,
        goToErrorPage,
        jumpToPage,
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
    setToken: PropTypes.func,
  };

  return Wrapped;
};

export default withSession;
