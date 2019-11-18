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
      <span className="vads-u-padding-right--1">
        {getTypeOfCare(data)?.name}{' '}
      </span>
      <Link
        aria-label="Edit type of care"
        to={newAppointmentFlow.typeOfCare.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Where</h2>
      <span className="vads-u-padding-right--1">
        {clinic?.clinicFriendlyLocationName || clinic?.clinicName}
      </span>
      <Link
        aria-label="Edit location of appointment"
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
      <span className="vads-u-padding-right--1">
        {moment(data.calendarData.selectedDates[0].datetime).format(
          'MMMM D, YYYY [at] hh:mm a',
        )}{' '}
      </span>
      <Link
        aria-label="Edit appointment date"
        to={newAppointmentFlow.appointmentTime.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Purpose</h2>
      <span className="vads-u-padding-right--1">
        {data.reasonForAppointment}{' '}
      </span>
      <Link
        aria-label="Edit purpose of appointment"
        to={newAppointmentFlow.reasonForAppointment.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Phone number
      </h2>
      <span className="vads-u-padding-right--1">{data.phoneNumber} </span>
      <Link
        aria-label="Edit phone number"
        to={newAppointmentFlow.contactInfo.url}
      >
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Email</h2>
      <span className="vads-u-padding-right--1">{data.email} </span>
      <Link aria-label="Edit email" to={newAppointmentFlow.contactInfo.url}>
        Edit
      </Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Additional details
      </h2>
      <span className="vads-u-padding-right--1">{data.additionalDetails} </span>
      <Link
        aria-label="Edit additional details"
        to={newAppointmentFlow.reasonForAppointment.url}
      >
        Edit
      </Link>
    </div>
  );
}
