import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { getTypeOfCare } from '../utils/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import { TYPE_OF_VISIT } from '../utils/constants';

function formatBestTime(bestTime) {
  if (bestTime?.morning) {
    return 'Morning';
  } else if (bestTime?.afternoon) {
    return 'Afternoon';
  } else if (bestTime?.evening) {
    return 'Evening';
  }

  return 'Anytime during the day';
}

export default function ReviewRequestInfo({ data, facility }) {
  return (
    <div>
      <h1 className="vads-u-font-size--h2">Review your appointment</h1>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Type of care
      </h2>
      <span className="vads-u-padding-right--1">
        {getTypeOfCare(data)?.name}{' '}
      </span>
      <Link to={newAppointmentFlow.typeOfCare.url}>Edit</Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Where</h2>
      <span className="vads-u-padding-right--1">
        {facility?.institution.authoritativeName}
      </span>
      <Link to={newAppointmentFlow.vaFacility.url}>Edit</Link>
      <br />
      {facility?.institution.city}, {facility?.institution.stateAbbrev}
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Purpose</h2>
      <span className="vads-u-padding-right--1">
        {data.reasonForAppointment}{' '}
      </span>
      <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">Type</h2>
      <span className="vads-u-padding-right--1">
        {TYPE_OF_VISIT[data.visitType]}{' '}
      </span>
      <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
      <AlertBox status="info" headline="Where and when we'll call you">
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">Email</h2>
        <span className="vads-u-padding-right--1">{data.email} </span>
        <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">
          Phone number
        </h2>
        <span className="vads-u-padding-right--1">{data.phoneNumber} </span>
        <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">
          Call-back time
        </h2>
        <span className="vads-u-padding-right--1">
          {formatBestTime(data.bestTimeToCall)}{' '}
        </span>
        <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
      </AlertBox>
    </div>
  );
}
