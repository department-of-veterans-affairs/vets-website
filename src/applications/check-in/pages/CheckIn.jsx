import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { goToNextPageWithToken, getTokenFromRouter } from '../utils/navigation';

import { checkInUser } from '../api';

import BackToHome from '../components/BackToHome';

const CheckIn = props => {
  const { router, appointment } = props;

  if (!appointment) {
    goToNextPageWithToken(router, 'failed');
    return <></>;
  }

  const token = getTokenFromRouter(router);
  const onClick = async () => {
    const json = await checkInUser({
      token,
    });
    const { data } = json;
    if (data.checkInStatus === 'completed') {
      goToNextPageWithToken(router, 'confirmed');
    } else {
      goToNextPageWithToken(router, 'failed');
    }
  };
  const contactNumber = '555-867-5309';

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
    <div className="vads-l-grid-container vads-u-padding-y--5">
      <h1 tabIndex="-1">Your appointment</h1>
      <dl className="appointment-summary">
        <dd
          className="appointment-details vads-u-font-weight--bold vads-u-font-family--serif"
          data-testid="appointment-date"
        >
          {appointmentDate}
        </dd>
        <dd
          className="appointment-details vads-u-font-weight--bold vads-u-margin-bottom--3 vads-u-font-family--serif"
          data-testid="appointment-time"
        >
          {appointmentTime} {timeZone}
        </dd>
        <dt className="vads-u-font-weight--bold vads-u-margin--0 vads-u-margin-right--1">
          Clinic:{' '}
        </dt>
        <dd data-testid="clinic-name">{appointment.clinicName}</dd>
      </dl>
      <button
        type="button"
        className="usa-button usa-button-big"
        onClick={onClick}
        data-testid="check-in-button"
      >
        Check in now
      </button>
      <footer className="row">
        <h2 className="help-heading vads-u-font-size--lg">Need help?</h2>
        <p>
          Ask a staff member or call us at <Telephone contact={contactNumber} />
          .
        </p>
      </footer>
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
