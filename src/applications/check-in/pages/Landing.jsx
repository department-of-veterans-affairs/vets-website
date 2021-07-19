import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { getTokenFromLocation, URLS, goToNextPage } from '../utils/navigation';
import { validateToken } from '../api';
import { receivedAppointmentDetails } from '../actions';

const Landing = props => {
  const { router, setAppointment, location } = props;

  useEffect(
    () => {
      const token = getTokenFromLocation(location);
      if (token) {
        validateToken(token)
          .then(json => {
            const { data } = json;
            if (data.error) {
              goToNextPage(router, URLS.SEE_STAFF);
            } else {
              // dispatch data into redux
              setAppointment({ appointment: { ...data }, context: { token } });
              goToNextPage(router, URLS.UPDATE_INSURANCE);
            }
          })
          .catch(() => {
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
    setAppointment: value => dispatch(receivedAppointmentDetails(value)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(Landing);
