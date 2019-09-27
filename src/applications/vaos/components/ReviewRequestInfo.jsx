import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { getTypeOfCare } from '../utils/selectors';
import newAppointmentFlow from '../newAppointmentFlow';

export default function ReviewRequestInfo({ data, facility }) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">Review your appointment</h1>
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">
        Type of care
      </h2>
      {getTypeOfCare(data)?.name}{' '}
      <Link to={newAppointmentFlow.typeOfCare.url}>Edit</Link>
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">Where</h2>
      {facility?.institution.authoritativeName}
      <br />
      {facility?.institution.city}, {facility?.institution.stateAbbrev}
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">
        Appointment date
      </h2>
      {moment(data.appointmentDate).format('MMMM M, YYYY [at] hh:mm a')}{' '}
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">Purpose</h2>
      <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
      {data.reasonForAppointment}
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">
        Phone number
      </h2>
      <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
      {data.phoneNumber}
      <h2 className="vads-u-font-size--h5 vads-u-font-family--sans">Email</h2>
      <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
      {data.email}
    </div>
  );
}
