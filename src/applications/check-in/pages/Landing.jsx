import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { validateToken } from '../api';
import { receivedAppointmentDetails } from '../actions';
import { setCurrentToken, clearCurrentSession } from '../utils/session';
import { createAnalyticsSlug } from '../utils/analytics';
import { isUUID } from '../utils/token-format-validator';
import SpeedTracker from '../components/SpeedTracker';

const Landing = props => {
  const { router, setAppointment, location, isLowAuthEnabled } = props;

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
        recordEvent({
          event: 'api_call',
          'api-name': 'lorota-token-validation',
          'api-status': 'started',
          UUID: token,
        });
        validateToken(token)
          .then(json => {
            const { data } = json;
            if (data.error || data.errors) {
              const error = data.error || data.errors;
              recordEvent({
                event: 'api_call',
                'api-name': 'lorota-token-validation',
                'api-status': 'failed',
                'error-key': error,
                UUID: token,
              });
              goToNextPage(router, URLS.ERROR);
            } else {
              recordEvent({
                event: 'api_call',
                'api-name': 'lorota-token-validation',
                'api-status': 'success',
                UUID: token,
              });
              // dispatch data into redux and local storage
              setAppointment(data, token);
              setCurrentToken(window, token);
              if (isLowAuthEnabled) {
                goToNextPage(router, URLS.VALIDATION_NEEDED);
              } else {
                goToNextPage(router, URLS.UPDATE_INSURANCE);
              }
            }
          })
          .catch(error => {
            clearCurrentSession(window);
            recordEvent({
              event: 'api_call',
              'api-name': 'lorota-token-validation',
              'api-status': 'failed',
              'error-key': error.message || error,
              UUID: token,
            });
            goToNextPage(router, URLS.ERROR);
          });
      }
    },
    [router, setAppointment, location, isLowAuthEnabled],
  );
  return (
    <>
      <SpeedTracker />
      <LoadingIndicator message="Finding your appointment" />
    </>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(receivedAppointmentDetails(data, token)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
