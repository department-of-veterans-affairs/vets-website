import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { getTypeOfCare } from '../utils/selectors';
import newAppointmentFlow from '../newAppointmentFlow';

export default function ReviewDirectScheduleInfo({ data, facility, clinic }) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">Review your appointment</h1>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Type of care
      </h2>
      {getTypeOfCare(data)?.name}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.typeOfCare.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Where</h2>
      {clinic?.clinicFriendlyLocationName || clinic?.clinicName}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.vaFacility.url}
      >
        Edit
      </Link>
      <br />
      {facility?.institution.authoritativeName}
      <br />
      {facility?.institution.city}, {facility?.institution.stateAbbrev}
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Appointment date
      </h2>
      {moment(data.appointmentDate).format('MMMM M, YYYY [at] hh:mm a')}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.appointmentTime.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Purpose</h2>
      {data.reasonForAppointment}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.reasonForAppointment.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Phone number
      </h2>
      {data.phoneNumber}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.contactInfo.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Email</h2>
      {data.email}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.contactInfo.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Additional details
      </h2>
      {data.additionalDetails}{' '}
      <Link
        className="vads-u-padding-left--1"
        to={newAppointmentFlow.reasonForAppointment.url}
      >
        Edit
      </Link>
    </div>
  );
}
