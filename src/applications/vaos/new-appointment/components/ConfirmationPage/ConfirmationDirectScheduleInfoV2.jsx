import React from 'react';
import { Link } from 'react-router-dom';
import moment from '../../../lib/moment-tz.js';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event.js';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import AddToCalendar from '../../../components/AddToCalendar';
import { formatFacilityAddress } from '../../../services/location';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneBySystemId,
} from '../../../utils/timezone';
import { GA_PREFIX, PURPOSE_TEXT } from '../../../utils/constants';

export default function ConfirmationDirectScheduleInfo({
  data,
  facilityDetails,
  clinic,
  slot,
  systemId,
}) {
  const timezone = getTimezoneBySystemId(systemId);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone.timezone, true)
    : moment(slot.start);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');

  return (
    <>
      <h1 className="vads-u-font-size--h2">
        {momentDate.format('dddd, MMMM D, YYYY [at] h:mm a')}
        {` ${getTimezoneAbbrBySystemId(systemId)}`}
      </h1>
      <AlertBox status="success" backgroundOnly>
        <strong>Your appointment has been scheduled and is confirmed.</strong>
        <br />
        <div className="vads-u-margin-y--1">
          <Link
            to="/"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              });
            }}
          >
            View your appointments
          </Link>
        </div>
        <div>
          <Link to="/new-appointment">New appointment</Link>
        </div>
      </AlertBox>
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-top--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <h2
            className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
            data-cy="va-appointment-details-header"
          >
            VA Appointment
          </h2>
          <VAFacilityLocation
            facility={facilityDetails}
            facilityName={facilityDetails?.name}
            facilityId={facilityDetails.id}
            isHomepageRefresh
            clinicFriendlyName={clinic.serviceName}
          />
        </div>
        <div className="vads-u-flex--1 vads-u-margin-top--2 vaos-u-word-break--break-word">
          <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
            Your reason for your visit
          </h3>
          <div>
            {
              PURPOSE_TEXT.find(
                purpose => purpose.id === data.reasonForAppointment,
              )?.short
            }
            : {data.reasonAdditionalInfo}
          </div>
        </div>
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <i
          aria-hidden="true"
          className="far fa-calendar vads-u-margin-right--1"
        />
        <AddToCalendar
          summary="VA Appointment"
          description=""
          location={formatFacilityAddress(facilityDetails)}
          startDateTime={momentDate.format()}
          duation={appointmentLength}
        />
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        <button className="va-button-link" onClick={() => window.print()}>
          Print
        </button>
      </div>
    </>
  );
}
