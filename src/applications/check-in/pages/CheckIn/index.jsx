import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import { focusElement } from 'platform/utilities/ui';

import { receivedAppointmentDetails } from '../../actions';
import { goToNextPage, URLS } from '../../utils/navigation';
import { api } from '../../api';

import Display from './Display';

const CheckIn = props => {
  const {
    router,
    appointments,
    context,
    isUpdatePageEnabled,
    isLowAuthEnabled,
    setAppointment,
  } = props;
  const appointment = appointments[0];

  const [isLoadingData, setIsLoadingData] = useState(!appointment.startTime);
  const { token } = context;
  useEffect(
    () => {
      if (isLowAuthEnabled) {
        // load data from checks route
        api.v1.getCheckInData(token).then(json => {
          const { data } = json;
          setAppointment(data, token);
          setIsLoadingData(false);
        });
      } else {
        focusElement('h1');
      }
    },
    [token, isLowAuthEnabled, setAppointment],
  );

  if (isLoadingData) {
    return <LoadingIndicator message={'Loading appointment details'} />;
  } else if (!appointment) {
    goToNextPage(router, URLS.ERROR);
    return <></>;
  } else {
    return (
      <Display
        isUpdatePageEnabled={isUpdatePageEnabled}
        isLowAuthEnabled={isLowAuthEnabled}
        router={router}
        token={token}
        appointment={appointment}
      />
    );
  }
};

const mapStateToProps = state => {
  return {
    appointments: state.checkInData.appointments,
    context: state.checkInData.context,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setAppointment: (data, token) =>
      dispatch(receivedAppointmentDetails(data, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckIn);
