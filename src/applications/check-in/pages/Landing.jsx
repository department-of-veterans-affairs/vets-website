import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { validateToken } from '../api';
import { receivedAppointmentDetails } from '../actions';
import { setCurrentToken } from '../utils/session';
import { createAnalyticsSlug } from '../utils/analytics';

const Landing = props => {
  const { router, setAppointment, location } = props;

  useEffect(
    () => {
      const token = getTokenFromLocation(location);
      if (!token) {
        recordEvent({
          event: createAnalyticsSlug('landing-page-launched-no-token'),
        });
      }

      if (token) {
        recordEvent({
          event: createAnalyticsSlug('uuid-validate-api-call-launched'),
          UUID: token,
        });
        validateToken(token)
          .then(json => {
            const { data } = json;
            if (data.error) {
              const error = data.error || data.errors;
              recordEvent({
                event: createAnalyticsSlug('uuid-validate-api-call-failed'),
                UUID: token,
                error,
              });
              goToNextPage(router, URLS.SEE_STAFF);
            } else {
              recordEvent({
                event: createAnalyticsSlug('uuid-validate-api-call-successful'),
                UUID: token,
              });
              // dispatch data into redux and local storage
              setAppointment(data, token);
              setCurrentToken(window, token);
              goToNextPage(router, URLS.UPDATE_INSURANCE);
            }
          })
          .catch(error => {
            recordEvent({
              event: createAnalyticsSlug('uuid-validate-api-call-failed'),
              UUID: token,
              response: error,
            });
            goToNextPage(router, URLS.ERROR);
          });
      }
    },
    [router, setAppointment, location],
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
      dispatch(receivedAppointmentDetails(data, token)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
