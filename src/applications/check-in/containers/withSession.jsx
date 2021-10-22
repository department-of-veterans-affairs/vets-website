import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { goToNextPage, URLS } from '../utils/navigation';
import {
  getCurrentToken,
  setCurrentToken,
  clearCurrentSession,
} from '../utils/session';
import { api } from '../api';
import { triggerRefresh, tokenWasValidated } from '../actions';
import { SCOPES } from '../utils/token-format-validator';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

const withSession = Component => {
  const Wrapped = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState();
    const { checkInData, router, setAuthenticatedSession, setToken } = props;
    const { context } = checkInData;

    useEffect(
      () => {
        const session = getCurrentToken(window);
        if (!context || !session) {
          goToNextPage(router, URLS.ERROR);
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
                  goToNextPage(router, URLS.ERROR);
                } else {
                  // if session with read.full exists, go to check in page
                  setCurrentToken(window, token);
                  if (session.permissions === SCOPES.READ_FULL) {
                    setAuthenticatedSession(token);
                    goToNextPage(router, URLS.DETAILS);
                  } else {
                    setToken(token);
                    goToNextPage(router, URLS.VALIDATION_NEEDED);
                  }
                }
              })
              .catch(() => {
                clearCurrentSession(window);
                goToNextPage(router, URLS.ERROR);
              });
          }
        }
      },
      [router, context, setAuthenticatedSession, setToken],
    );

    if (isLoading) {
      return (
        <>
          <LoadingIndicator message={'Finding your session'} />
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
    checkInData: PropTypes.object,
    router: PropTypes.object,
    setAuthenticatedSession: PropTypes.func,
    setToken: PropTypes.func,
  };

  return Wrapped;
};

const mapStateToProps = state => ({
  checkInData: state.checkInData,
});

const mapDispatchToProps = dispatch => {
  return {
    setToken: token => {
      dispatch(tokenWasValidated(undefined, token, SCOPES.READ_BASIC));
      dispatch(triggerRefresh());
    },
    setAuthenticatedSession: token =>
      dispatch(tokenWasValidated(undefined, token, SCOPES.READ_FULL)),
  };
};

const composedWrapper = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withSession,
);
export default composedWrapper;
