import React from 'react';
import { Link } from 'react-router-dom';
import moment from '../../../lib/moment-tz.js';
import recordEvent from 'platform/monitoring/record-event.js';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import AddToCalendar from '../../../components/AddToCalendar';
import InfoAlert from '../../../components/InfoAlert';
import {
  formatFacilityAddress,
  getFacilityPhone,
} from '../../../services/location';
import {
  getTimezoneAbbrByFacilityId,
  getTimezoneByFacilityId,
} from '../../../utils/timezone';
import { GA_PREFIX, PURPOSE_TEXT } from '../../../utils/constants';
import { getTypeOfCareById } from '../../../utils/appointment';

export default function ConfirmationDirectScheduleInfoV2({
  data,
  facilityDetails,
  clinic,
  slot,
}) {
  const timezone = getTimezoneByFacilityId(data.vaFacility);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone, true)
    : moment(slot.start);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  const typeOfCare = getTypeOfCareById(data.typeOfCareId)?.name;
  return (
    <>
      <h1 className="vads-u-font-size--h2">
        {momentDate.format('dddd, MMMM D, YYYY [at] h:mm a')}
        {` ${getTimezoneAbbrByFacilityId(data.vaFacility)}`}
      </h1>
      <InfoAlert status="success" backgroundOnly>
        <strong>We’ve scheduled and confirmed your appointment.</strong>
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
            Review your appointments
          </Link>
        </div>
        <div>
          <Link to="/new-appointment">Schedule a new appointment</Link>
        </div>
      </InfoAlert>
      {typeOfCare && (
        <>
          <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
            Type of care:
          </h2>
          <div className="vads-u-display--inline"> {typeOfCare}</div>
        </>
      )}
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
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
            clinicFriendlyName={clinic.serviceName}
          />
        </div>
        <div className="vads-u-flex--1 vaos-u-word-break--break-word">
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
          summary={`Appointment at ${clinic.serviceName}`}
          description={{
            text: `You have a health care appointment at ${clinic.serviceName}`,
            phone: getFacilityPhone(facilityDetails),
            additionalText: [
              'Sign in to VA.gov to get details about this appointment',
            ],
          }}
          location={formatFacilityAddress(facilityDetails)}
          startDateTime={momentDate.format()}
          duration={appointmentLength}
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
