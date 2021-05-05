import React, { useEffect } from 'react';
import moment from '../../lib/moment-tz.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone.js';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants.js';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import { selectConfirmationPage } from '../redux/selectors.js';
import AddToCalendar from 'applications/vaos/components/AddToCalendar';
import { formatFacilityAddress } from 'applications/vaos/services/location';

const pageTitle = 'We’ve scheduled your appointment';

function ConfirmationPageV2({
  clinic,
  data,
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

  const appointmentDateString =
    moment(data.date1, 'YYYY-MM-DDTHH:mm:ssZ').format(
      'dddd, MMMM D, YYYY [at] h:mm a ',
    ) + getTimezoneAbbrBySystemId(systemId);

  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{appointmentDateString}</h1>
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
            COVID-19 vaccine
          </h2>
          <VAFacilityLocation
            facility={facilityDetails}
            facilityName={facilityDetails?.name}
            facilityId={facilityDetails.id}
            isHomepageRefresh
            clinicFriendlyName={clinic?.serviceName}
          />
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
          startDateTime={appointmentDateString}
          duration={appointmentLength}
        />
      </div>

      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i aria-hidden="true" className="fas fa-print vads-u-margin-right--1" />
        <button className="va-button-link" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <AlertBox
        status={ALERT_TYPE.INFO}
        className="vads-u-display--block"
        headline="Need to make changes?"
        backgroundOnly
      >
        Contact this provider if you need to reschedule or cancel your
        appointment.
      </AlertBox>
    </div>
  );
}

export default connect(selectConfirmationPage)(ConfirmationPageV2);
