import React, { useEffect } from 'react';
import moment from '../../lib/moment-tz.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneBySystemId,
} from '../../utils/timezone.js';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants.js';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import { selectConfirmationPage } from '../redux/selectors.js';
import AddToCalendar from '../../components/AddToCalendar';
import InfoAlert from '../../components/InfoAlert';
import {
  formatFacilityAddress,
  getFacilityPhone,
} from '../../services/location';

const pageTitle = 'We’ve scheduled your appointment';

function ConfirmationPageV2({
  clinic,
  systemId,
  facilityDetails,
  slot,
  submitStatus,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  if (submitStatus !== FETCH_STATUS.succeeded) {
    return <Redirect to="/" />;
  }

  const timezone = getTimezoneBySystemId(systemId);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone.timezone, true)
    : moment(slot.start);

  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        {momentDate.format('dddd, MMMM D, YYYY [at] h:mm a')}
        {` ${getTimezoneAbbrBySystemId(systemId)}`}
      </h1>
      <InfoAlert status="success" backgroundOnly>
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
      </InfoAlert>
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-top--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <h2
            className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
            data-cy="va-appointment-details-header"
          >
            COVID-19 vaccine
          </h2>
          <VAFacilityLocation
            facility={facilityDetails}
            facilityName={facilityDetails?.name}
            facilityId={facilityDetails.id}
            isHomepageRefresh
            clinicFriendlyName={clinic?.serviceName}
            showCovidPhone
          />
        </div>
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <i
          aria-hidden="true"
          className="far fa-calendar vads-u-margin-right--1"
        />
        <AddToCalendar
          summary={`Appointment at ${clinic?.serviceName}`}
          description={{
            text: `You have a health care appointment at ${
              clinic?.serviceName
            }`,
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
      <InfoAlert status="info" headline="Need to make changes?" backgroundOnly>
        Contact this provider if you need to reschedule or cancel your
        appointment.
      </InfoAlert>
    </div>
  );
}

export default connect(selectConfirmationPage)(ConfirmationPageV2);
