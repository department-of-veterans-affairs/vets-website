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
      <h1 className="vads-u-font-size--h2">Review your appointment</h1>
      <h2 className="vaos-appts__block-label vads-u-margin-top--2">
        Type of care
      </h2>
      <span className="vads-u-padding-right--1">
        {getTypeOfCare(data)?.name}
      </span>
      <Link
        aria-label="Edit type of care"
        to={newAppointmentFlow.typeOfCare.url}
      >
        Edit
      </Link>
      <br />
      {isCommunityCare && 'Community Care'}
      {!isCommunityCare && (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Where
          </h2>
          <span className="vads-u-padding-right--1">
            {facility?.institution.authoritativeName}
          </span>
          <Link
            aria-label="Edit location of appointment"
            to={newAppointmentFlow.vaFacility.url}
          >
            Edit
          </Link>
          <br />
          {facility?.institution.city}, {facility?.institution.stateAbbrev}
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Purpose
          </h2>
          <span className="vads-u-padding-right--1">
            {PURPOSE_TEXT[data.reasonForAppointment]}{' '}
          </span>
          <Link
            aria-label="Edit purpose of appointment"
            to={newAppointmentFlow.reasonForAppointment.url}
          >
            Edit
          </Link>
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">Type</h2>
          <span className="vads-u-padding-right--1">
            {TYPE_OF_VISIT.find(v => v.id === data.visitType)?.name}{' '}
          </span>
          <Link
            aria-label="Edit how to be seen"
            to={newAppointmentFlow.visitType.url}
          >
            Edit
          </Link>
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
              <Link
                aria-label="Edit provider preference"
                to={newAppointmentFlow.ccPreferences.url}
              >
                Edit
              </Link>
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
              <Link
                aria-label="Edit provider preference"
                to={newAppointmentFlow.ccPreferences.url}
              >
                Edit
              </Link>
            </>
          )}
          {!!vaCityState && (
            <>
              <h2 className="vaos-appts__block-label vads-u-margin-top--2">
                Closest VA location
              </h2>
              <span className="vads-u-padding-right--1">{vaCityState}</span>
              <Link
                aria-label="Edit closest VA location"
                to={newAppointmentFlow.ccPreferences.url}
              >
                Edit
              </Link>
            </>
          )}
          <h2 className="vaos-appts__block-label vads-u-margin-top--2">
            Language preference
          </h2>
          <span className="vads-u-padding-right--1">
            {LANGUAGES.find(lang => lang.id === data.preferredLanguage)?.text}
          </span>
          <Link
            aria-label="Edit language preference"
            to={newAppointmentFlow.ccPreferences.url}
          >
            Edit
          </Link>
        </>
      )}
      <AlertBox status="info" headline="Where and when we’ll call you">
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">Email</h2>
        <span className="vads-u-padding-right--1">{data.email} </span>
        <Link aria-label="Edit email" to={newAppointmentFlow.contactInfo.url}>
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
        <h2 className="vaos-appts__block-label vads-u-margin-top--2">
          Call-back time
        </h2>
        <span className="vads-u-padding-right--1">
          {formatBestTime(data.bestTimeToCall)}{' '}
        </span>
        <Link
          aria-label="Edit call back time"
          to={newAppointmentFlow.contactInfo.url}
        >
          Edit
        </Link>
      </AlertBox>
    </div>
  );
}
