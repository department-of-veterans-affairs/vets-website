import React from 'react';
import moment from '../../../lib/moment-tz.js';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import FacilityAddress from '../../../components/FacilityAddress';
import AddToCalendar from '../../../components/AddToCalendar';
import { formatFacilityAddress } from '../../../services/location';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneBySystemId,
} from '../../../utils/timezone';
import { PURPOSE_TEXT } from '../../../utils/constants';

export default function ConfirmationDirectScheduleInfo({
  data,
  facilityDetails,
  clinic,
  pageTitle,
  slot,
  systemId,
}) {
  const timezone = getTimezoneBySystemId(systemId);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone.timezone, true)
    : moment(slot.start);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <AlertBox status="success">
        <strong>Your appointment is confirmed</strong>
        <br />
        Please see your appointment details below.
      </AlertBox>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-y--3 vads-u-border-top--4px vads-u-border-color--green">
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          VA Appointment
        </div>
        <h2 className="vaos-appts__date-time vads-u-font-size--lg vads-u-margin-x--0">
          {momentDate.format('MMMM D, YYYY [at] h:mm a')}
          {` ${getTimezoneAbbrBySystemId(systemId)}`}
        </h2>
        <div className="vads-u-margin-top--2">
          <i aria-hidden="true" className="fas fa-check-circle" />
          <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
            Confirmed
            <span className="sr-only"> appointment</span>
          </span>
        </div>

        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-top--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
            <h3 className="vaos-appts__block-label">{clinic?.serviceName}</h3>
            <div>
              {!!facilityDetails && (
                <>
                  {facilityDetails.name}
                  <br />
                  <FacilityAddress facility={facilityDetails} />
                </>
              )}
            </div>
          </div>
          <div className="vads-u-flex--1 vads-u-margin-top--2 vaos-u-word-break--break-word">
            <h3 className="vaos-appts__block-label">
              {
                PURPOSE_TEXT.find(
                  purpose => purpose.id === data.reasonForAppointment,
                )?.short
              }
            </h3>
            <div>{data.reasonAdditionalInfo}</div>
          </div>
        </div>
        {facilityDetails && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar
              summary="VA Appointment"
              description=""
              location={formatFacilityAddress(facilityDetails)}
              startDateTime={momentDate.format()}
              duation={appointmentLength}
            />
          </div>
        )}
      </div>
    </div>
  );
}
