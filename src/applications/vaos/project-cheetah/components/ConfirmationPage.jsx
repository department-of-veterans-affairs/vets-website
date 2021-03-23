import React, { useEffect } from 'react';
import moment from '../../lib/moment-tz.js';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone.js';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants.js';
import FacilityAddress from '../../components/FacilityAddress.jsx';
import { selectConfirmationPage } from '../redux/selectors.js';
import AddToCalendar from 'applications/vaos/components/AddToCalendar';
import { formatFacilityAddress } from 'applications/vaos/services/location';

const pageTitle = 'Your appointment has been scheduled';

function ConfirmationPage({ data, systemId, facilityDetails, submitStatus }) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  if (submitStatus !== FETCH_STATUS.succeeded) {
    return <Redirect to="/" />;
  }

  const appointmentType = 'COVID-19 Vaccine';
  const appointmentDateString =
    moment(data.date1, 'YYYY-MM-DDTHH:mm:ssZ').format(
      'dddd, MMMM D, YYYY [at] h:mm a ',
    ) + getTimezoneAbbrBySystemId(systemId);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <AlertBox status="success">
        <strong>
          Your appointment is confirmed. Please see your appointment details
          below.
        </strong>
      </AlertBox>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
        <span className="vads-u-margin-y--0 vaos-u-text-transform--uppercase">
          {appointmentType}
        </span>
        <br />
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--1 vads-u-margin-bottom--2">
          {appointmentDateString}
        </h2>
        <strong>
          <i className="fa fa-check-circle vads-u-color--green" />
          <span className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block">
            Confirmed
          </span>
        </strong>
        <br />
        {facilityDetails && (
          <div className="vads-u-margin-top--2">
            <FacilityAddress
              name={facilityDetails.name}
              facility={facilityDetails}
              level={3}
              showDirectionsLink
            />
          </div>
        )}
        <div className="vads-u-margin-top--3 vaos-appts__block-label">
          <AddToCalendar
            summary={appointmentType.concat(' Appointment')}
            location={formatFacilityAddress(facilityDetails)}
            startDateTime={data.date1[0]}
          />
        </div>
      </div>
      <div className="vads-u-margin-y--2">
        <Link
          to="/"
          className="usa-button vads-u-padding-right--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
            });
          }}
        >
          View your appointments
        </Link>
      </div>
    </div>
  );
}

export default connect(selectConfirmationPage)(ConfirmationPage);
