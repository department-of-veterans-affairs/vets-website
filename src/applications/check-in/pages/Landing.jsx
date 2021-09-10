import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { validateToken } from '../api';
import { tokenWasValidated } from '../actions';
import { setCurrentToken, clearCurrentSession } from '../utils/session';
import { createAnalyticsSlug } from '../utils/analytics';
import { isUUID, SCOPES } from '../utils/token-format-validator';

const Landing = props => {
  const {
    router,
    setAppointment,
    location,
    isLowAuthEnabled,
    isUpdatePageEnabled,
  } = props;

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
        validateToken(token)
          .then(json => {
            const { data } = json;
            if (data.error || data.errors) {
              goToNextPage(router, URLS.ERROR);
            } else {
              // dispatch data into redux and local storage
              setAppointment(data, token);
              setCurrentToken(window, token);
              if (isLowAuthEnabled) {
                goToNextPage(router, URLS.VALIDATION_NEEDED);
              } else if (isUpdatePageEnabled) {
                goToNextPage(router, URLS.UPDATE_INSURANCE);
              } else {
                goToNextPage(router, URLS.DETAILS);
              }
            }
          })
          .catch(() => {
            clearCurrentSession(window);
            goToNextPage(router, URLS.ERROR);
          });
      }
    },
    [router, setAppointment, location, isLowAuthEnabled, isUpdatePageEnabled],
  );
  return (
    <>
      <LoadingIndicator message="Finding your appointment" />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(tokenWasValidated(data, token, SCOPES.READ_BASIC)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
