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
            const { data, isValid } = json;
            // console.log({ data });
            if (isValid) {
              // dispatch data into redux
              setAppointment(data);
              goToNextPage(router, URLS.UPDATE_INSURANCE);
            } else {
              goToNextPage(router, URLS.SEE_STAFF);
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
