import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { focusElement } from 'platform/utilities/ui';

import { goToNextPage, URLS } from '../utils/navigation';
import { checkInUser } from '../api';

import BackToHome from '../components/BackToHome';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';

const CheckIn = props => {
  const [isLoading, setIsLoading] = useState(false);
  const { router, appointment } = props;

  useEffect(() => {
    focusElement('h1');
  }, []);

  if (!appointment) {
    goToNextPage(router, URLS.SEE_STAFF);
    return <></>;
  }

  const onClick = async () => {
    const token = appointment.uuid;
    setIsLoading(true);
    const json = await checkInUser({
      token,
    });
    const { data } = json;
    if (data.checkInStatus === 'completed') {
      goToNextPage(router, URLS.COMPLETE);
    } else {
      goToNextPage(router, URLS.SEE_STAFF);
    }
  };

  const appointmentDate = moment(new Date(appointment.appointmentTime)).format(
    'dddd, MMMM D, YYYY',
  );
  const usersTimeZone = moment.tz.guess();
  const timeZone = moment()
    .tz(usersTimeZone)
    .zoneAbbr();
  const appointmentTime = moment(new Date(appointment.appointmentTime)).format(
    `h:mm`,
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
      <BackButton router={router} />
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
          {appointmentTime} {timeZone}
        </dd>
        <dt className="vads-u-font-size--lg  vads-u-margin--0 vads-u-margin-right--1">
          Clinic:{' '}
        </dt>
        <dd data-testid="clinic-name" className="vads-u-font-size--lg">
          {appointment.clinicName}
        </dd>
      </dl>
      <button
        type="button"
        className="usa-button usa-button-big"
        onClick={onClick}
        data-testid="check-in-button"
        disabled={isLoading}
        aria-label="Check in now for your appointment"
      >
        {isLoading ? <>Loading...</> : <>Check in now</>}
      </button>
      <Footer />
      <BackToHome />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    appointment: state.checkInData.appointment,
  };
};
const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CheckIn);
