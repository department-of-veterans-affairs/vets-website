import React from 'react';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { getTypeOfCare } from '../utils/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
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

  return (
    <div>
      <h1 className="vads-u-font-size--h2">Appointment request submitted</h1>
      <AlertBox status="success">
        <strong>Your appointment request has been submitted.</strong> We're
        reviewing your request. You don't have anything to do right now. A
        scheduler will contact you to schedule the first available appointment.
      </AlertBox>
      <AlertBox backgroundOnly status="info">
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">
          {isCommunityCare ? 'Community Care' : 'VA'} appointment request —{' '}
          {getTypeOfCare(data)?.name}
        </h2>
        We'll contact you to schedule this appointment.
        <hr />
        <div className="vads-u-display--flex">
          <div className="vads-u-flex--1">
            <dl>
              <dt>{facility?.institution.authoritativeName}</dt>
              <dd>
                {facility?.institution.city},{' '}
                {facility?.institution.stateAbbrev}
              </dd>
              <dt>Your preferred date and time</dt>
              <dd />
            </dl>
          </div>
          <div className="vads-u-flex--1">
            <dl>
              <dt>{PURPOSE_TEXT[data.reasonForAppointment]}</dt>
              <dd>{data.reasonAdditionalInfo}</dd>
              <dt>Your contact details</dt>
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
      <br />
      {!isCommunityCare && (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Where
          </h2>
          <span className="vads-u-padding-right--1">
            {facility?.institution.authoritativeName}
          </span>
          <Link to={newAppointmentFlow.vaFacility.url}>Edit</Link>
          <br />
          {facility?.institution.city}, {facility?.institution.stateAbbrev}
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Purpose
          </h2>
          <span className="vads-u-padding-right--1">
            {PURPOSE_TEXT[data.reasonForAppointment]}{' '}
          </span>
          <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">Type</h2>
          <span className="vads-u-padding-right--1">
            {TYPE_OF_VISIT.find(v => v.id === data.visitType)?.name}{' '}
          </span>
          <Link to={newAppointmentFlow.visitType.url}>Edit</Link>
        </>
      )}
      {isCommunityCare && (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Provider preference
          </h2>
          {data.hasCommunityCareProvider && (
            <div className="vads-u-margin-bottom--2">
              <span className="vads-u-padding-right--1">
                {data.communityCareProvider.firstName}{' '}
                {data.communityCareProvider.lastName}
              </span>{' '}
              <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
              {!!data.communityCareProvider.practiceName && (
                <>
                  <br />
                  {data.communityCareProvider.practiceName}
                </>
              )}
              <br />
              {data.communityCareProvider.phone}
              <p>
                {data.communityCareProvider.address.street}
                {!!data.communityCareProvider.address.street2 && (
                  <>
                    <br />
                    {data.communityCareProvider.address.street2}
                  </>
                )}
                <br />
                {data.communityCareProvider.address.city},{' '}
                {data.communityCareProvider.address.state}{' '}
                {data.communityCareProvider.address.postalCode}
                <br />
              </p>
            </div>
          )}
          {!data.hasCommunityCareProvider && (
            <>
              <span className="vads-u-padding-right--1">Not specified</span>{' '}
              <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
            </>
          )}
          {!!vaCityState && (
            <>
              <h2 className="vaos-appts__block-label vads-u-margin-top--2">
                Closest VA location
              </h2>
              <span className="vads-u-padding-right--1">{vaCityState}</span>
              <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
            </>
          )}
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Language preference
          </h2>
          <span className="vads-u-padding-right--1">
            {LANGUAGES.find(lang => lang.id === data.preferredLanguage)?.text}
          </span>
          <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
        </>
      )}
      <AlertBox status="info" headline="Where and when we’ll call you">
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
        </span>
        <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
      </AlertBox>
    </div>
  );
}
