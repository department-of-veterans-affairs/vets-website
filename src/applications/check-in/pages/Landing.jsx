import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { validateToken } from '../api';
import { receivedAppointmentDetails } from '../actions';
import { createAnalyticsSlug } from '../utils/analytics';

const Landing = props => {
  const { router, setAppointment, location } = props;

  useEffect(
    () => {
      const token = getTokenFromLocation(location);
      recordEvent({
        event: createAnalyticsSlug('landing-page-launched'),
        UUID: token,
      });

      if (token) {
        recordEvent({
          event: createAnalyticsSlug('uuid-validate-api-call-launched'),
          UUID: token,
        });
        validateToken(token).then(json => {
          const { data, isValid } = json;
          // console.log({ data });
          if (isValid) {
            recordEvent({
              event: createAnalyticsSlug('uuid-validate-api-call-successful'),
              UUID: token,
            });
            // dispatch data into redux
            setAppointment(data);
            goToNextPage(router, URLS.UPDATE_INSURANCE);
          } else {
            recordEvent({
              event: createAnalyticsSlug('uuid-validate-api-call-failed'),
              UUID: token,
              response: data,
            });
            goToNextPage(router, URLS.SEE_STAFF);
          }
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
    setAppointment: value => dispatch(receivedAppointmentDetails(value)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
