import React, { useEffect } from 'react';
import moment from '../../lib/moment-tz.js';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event.js';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrByFacilityId } from '../../utils/timezone.js';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants.js';
import FacilityAddress from '../../components/FacilityAddress.jsx';
import { selectConfirmationPage } from '../redux/selectors.js';
import AddToCalendar from '../../components/AddToCalendar';
import InfoAlert from '../../components/InfoAlert';
import {
  formatFacilityAddress,
  getFacilityPhone,
} from '../../services/location';

const pageTitle = 'We’ve scheduled your appointment';

export default function ConfirmationPage() {
  const { data, slot, facilityDetails, submitStatus } = useSelector(
    selectConfirmationPage,
    shallowEqual,
  );
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
    ) + getTimezoneAbbrByFacilityId(data.vaFacility);

  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');

  return (
    <div>
      <h1>{pageTitle}</h1>
      <InfoAlert status="success">
        <strong>Your appointment is confirmed.</strong>
        <p>
          If you get a vaccine that requires a second dose, we'll schedule your
          second appointment while you're here for your first dose.
        </p>
      </InfoAlert>
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
              showCovidPhone
            />
          </div>
        )}
        <div className="vads-u-margin-top--3 vaos-appts__block-label">
          <AddToCalendar
            summary={`Appointment at ${facilityDetails.name}`}
            description={{
              text: `You have a health care appointment at ${
                facilityDetails.name
              }`,
              phone: getFacilityPhone(facilityDetails),
              additionalText: [
                'Sign in to VA.gov to get details about this appointment',
              ],
            }}
            location={formatFacilityAddress(facilityDetails)}
            startDateTime={data.date1[0]}
            duration={appointmentLength}
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
          Review your appointments
        </Link>
      </div>
    </div>
  );
}
