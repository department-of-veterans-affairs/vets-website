import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { api } from '../api';
import { tokenWasValidated, triggerRefresh } from '../actions';
import { setCurrentToken, clearCurrentSession } from '../utils/session';
import { createAnalyticsSlug } from '../utils/analytics';
import { isUUID, SCOPES } from '../utils/token-format-validator';

const Landing = props => {
  const {
    isUpdatePageEnabled,
    isMultipleAppointmentsEnabled,
    location,
    router,
    setAppointment,
    setAuthenticatedSession,
    setToken,
  } = props;

  const [loadMessage, setLoadMessage] = useState(
    'Finding your appointment information',
  );
  useEffect(
    () => {
      const token = getTokenFromLocation(location);
      if (!token) {
        recordEvent({
          event: createAnalyticsSlug('landing-page-launched-no-token'),
        });
        goToNextPage(router, URLS.ERROR);
      }

      if (!isUUID(token)) {
        recordEvent({
          event: createAnalyticsSlug('malformed-token'),
        });
        goToNextPage(router, URLS.ERROR);
      }

      if (token) {
        if (isMultipleAppointmentsEnabled) {
          api.v2
            .getSession(token)
            .then(session => {
              if (session.errors || session.error) {
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
        } else {
          api.v1
            .getSession(token)
            .then(session => {
              // if session with read.full exists, go to check in page
              setCurrentToken(window, token);
              setLoadMessage('Loading your appointment');
              if (session.permissions === SCOPES.READ_FULL) {
                goToNextPage(router, URLS.DETAILS);
              } else {
                // else get the data then go to validate page
                api.v1
                  .getCheckInData(token)
                  .then(json => {
                    // going to be read.basic data, which is facility name and number
                    const { data } = json;
                    setAppointment(data, token);
                    goToNextPage(router, URLS.VALIDATION_NEEDED);
                  })
                  .catch(() => {
                    clearCurrentSession(window);
                    goToNextPage(router, URLS.ERROR);
                  });
              }
            })
            .catch(() => {
              clearCurrentSession(window);
              goToNextPage(router, URLS.ERROR);
            });
        }
      }
    },
    [
      router,
      location,
      setAppointment,
      setToken,
      isUpdatePageEnabled,
      isMultipleAppointmentsEnabled,
      setAuthenticatedSession,
    ],
  );
  return (
    <>
      <LoadingIndicator message={loadMessage} />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(tokenWasValidated(data, token, SCOPES.READ_BASIC)),
    setToken: token => {
      dispatch(tokenWasValidated(undefined, token, SCOPES.READ_BASIC));
      dispatch(triggerRefresh());
    },
    setAuthenticatedSession: token =>
      dispatch(tokenWasValidated(undefined, token, SCOPES.READ_FULL)),
  };
};

Landing.propTypes = {
  isUpdatePageEnabled: PropTypes.bool,
  isMultipleAppointmentsEnabled: PropTypes.bool,
  location: PropTypes.object,
  router: PropTypes.object,
  setAppointment: PropTypes.func,
  setAuthenticatedSession: PropTypes.func,
  setToken: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
