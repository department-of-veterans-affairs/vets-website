import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import format from 'date-fns/format';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';

import { receivedAppointmentDetails } from '../actions';
import { goToNextPage, URLS } from '../utils/navigation';
import { v0, v1 } from '../api';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import AppointmentLocation from '../components/AppointmentLocation';

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

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(!appointment.startTime);
  const { token } = context;
  useEffect(
    () => {
      if (isLowAuthEnabled) {
        // load data from checks route
        v1.getCheckInData(token).then(json => {
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
    const onClick = async () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'check in now',
      });
      setIsCheckingIn(true);
      try {
        const json = await v0.checkInUser({
          token,
        });
        const { status } = json;
        if (status === 200) {
          goToNextPage(router, URLS.COMPLETE);
        } else {
          goToNextPage(router, URLS.ERROR);
        }
      } catch (error) {
        goToNextPage(router, URLS.ERROR);
      }
    };

    const appointmentDateTime = new Date(appointment.startTime);
    const appointmentDate = format(appointmentDateTime, 'cccc, LLLL d, yyyy');
    const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');

    return (
      <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
        {isUpdatePageEnabled && <BackButton router={router} />}
        <h1 tabIndex="-1" className="vads-u-margin-top--2">
          Your appointment
        </h1>
        <dl className="appointment-summary vads-u-font-weight--bold">
          <dd
            className="appointment-details  vads-u-font-family--serif"
            data-testid="appointment-date"
          >
            {appointmentDate}
          </dd>
          <dd
            className="appointment-details  vads-u-margin-bottom--3 vads-u-font-family--serif"
            data-testid="appointment-time"
          >
            {appointmentTime}
          </dd>
          <dt className="vads-u-font-size--lg  vads-u-margin--0 vads-u-margin-right--1">
            Clinic:{' '}
          </dt>
          <dd data-testid="clinic-name" className="vads-u-font-size--lg">
            <AppointmentLocation appointment={appointment} />
          </dd>
        </dl>
        <button
          type="button"
          className="usa-button usa-button-big"
          onClick={onClick}
          data-testid="check-in-button"
          disabled={isCheckingIn}
          aria-label="Check in now for your appointment"
        >
          {isCheckingIn ? <>Loading...</> : <>Check in now</>}
        </button>
        <Footer />
        <BackToHome />
      </div>
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
