import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { goToNextPageWithToken, getTokenFromRouter } from '../utils/navigation';
import { validateToken } from '../api';
import { receivedAppointmentDetails } from '../actions';

const Landing = props => {
  const { router, setAppointment } = props;

  useEffect(
    () => {
      const token = getTokenFromRouter(router);
      if (token) {
        validateToken(token).then(json => {
          const { data, isValid } = json;
          // console.log({ data });
          if (isValid) {
            // dispatch data into redux
            setAppointment(data);
            goToNextPageWithToken(router, 'insurance');
          } else {
            goToNextPageWithToken(router, 'failed');
          }
        });
      }
    },
    [router, setAppointment],
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
