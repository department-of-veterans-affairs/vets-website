import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { getTypeOfCare } from '../utils/selectors';
import { TYPE_OF_VISIT, LANGUAGES, PURPOSE_TEXT } from '../utils/constants';

function formatBestTime(bestTime) {
  const times = [];
  if (bestTime?.morning) {
    times.push('Morning');
  }

  if (bestTime?.afternoon) {
    times.push('Afternoon');
  }

  if (bestTime?.evening) {
    times.push('Evening');
  }

  if (times.length === 1) {
    return times[0];
  } else if (times.length === 2) {
    return `${times[0]} or ${times[1]}`;
  }

  return 'Anytime during the day';
}

export default function ReviewRequestInfo({ data, facility, vaCityState }) {
  const isCommunityCare = data.facilityType === 'communityCare';
  const isVideoVisit = data.visitType === 'telehealth';

  return (
    <div>
      <h1 className="vads-u-font-size--h2">Appointment request submitted</h1>
      <AlertBox status="success">
        <strong>Your appointment request has been submitted.</strong> We're
        reviewing your request. You don't have anything to do right now. A
        scheduler will contact you to schedule the first available appointment.
      </AlertBox>
      <AlertBox backgroundOnly status="info">
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          {isCommunityCare && 'Community Care appointment request — '}
          {isVideoVisit && 'VA Video Connect appointment request — '}
          {!isVideoVisit && !isCommunityCare && 'VA appointment request — '}
          {getTypeOfCare(data)?.name}
        </h2>
        We'll contact you to schedule this appointment.
        <hr />
        <div className="vads-u-display--flex">
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin-y--0">
              <dt>
                <strong>{facility?.institution.authoritativeName}</strong>
              </dt>
              <dd>
                {facility?.institution.city},{' '}
                {facility?.institution.stateAbbrev}
              </dd>
              <dt>
                <strong>Your preferred date and time</strong>
              </dt>
              <dd>
                <ul>
                  {data.calendarData.selectedDates.map(
                    ({ date, optionTime }) => (
                      <li key={`${date}-${optionTime}`}>
                        {moment(date).format('MMMM D, YYYY')}{' '}
                        {optionTime === 'AM'
                          ? 'in the morning'
                          : 'in the afternoon'}
                      </li>
                    ),
                  )}
                </ul>
              </dd>
            </dl>
          </div>
          <div className="vads-u-flex--1">
            <dl className="vads-u-margin-y--0">
              <dt>
                <strong>{PURPOSE_TEXT[data.reasonForAppointment]}</strong>
              </dt>
              <dd>{data.reasonAdditionalInfo}</dd>
              <dt>
                <strong>Your contact details</strong>
              </dt>
              <dd>
                {data.email}
                <br />
                {data.phoneNumber}
                <br />
                {formatBestTime(data.bestTimeToCall)}{' '}
              </dd>
            </dl>
          </div>
        </div>
      </AlertBox>
    </div>
  );
}
