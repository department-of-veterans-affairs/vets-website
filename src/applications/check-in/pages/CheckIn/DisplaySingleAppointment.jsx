import React, { useState } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';

import recordEvent from 'platform/monitoring/record-event';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import AppointmentLocation from '../../components/AppointmentDisplay/AppointmentLocation';

import { api } from '../../api';

import { goToNextPage, URLS } from '../../utils/navigation';

const DisplaySingleAppointment = props => {
  const { appointment, isUpdatePageEnabled, router, token } = props;
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const onClick = async () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'check in now',
    });
    setIsCheckingIn(true);
    try {
      const json = await api.v1.postCheckInData({
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
};

DisplaySingleAppointment.propTypes = {
  appointment: PropTypes.object,
  isUpdatePageEnabled: PropTypes.bool,
  router: PropTypes.object,
  token: PropTypes.string,
};

export default DisplaySingleAppointment;
