import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import moment from '../../../lib/moment-tz';
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
import { GA_PREFIX, PURPOSE_TEXT_V2 } from '../../../utils/constants';
import { getTypeOfCareById } from '../../../utils/appointment';
import { startNewAppointmentFlow } from '../../redux/actions';

function handleClick(history, dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(`/new-appointment`);
  };
}

export default function ConfirmationDirectScheduleInfoV2({
  data,
  facilityDetails,
  clinic,
  slot,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

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
          <va-link
            href="/my-health/appointments/"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              });
            }}
            text="Review your appointments"
            data-testid="review-appointments-link"
          />
        </div>
        <div>
          <va-link
            text="Schedule a new appointment"
            onClick={handleClick(history, dispatch)}
            data-testid="schedule-new-appointment-link"
          />
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
              PURPOSE_TEXT_V2.find(
                purpose => purpose.id === data.reasonForAppointment,
              )?.short
            }
            : {data.reasonAdditionalInfo}
          </div>
        </div>
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
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
        <va-button
          className="va-button-link"
          onClick={() => window.print()}
          text="Print"
          data-testid="print-button"
          uswds
        />
      </div>
    </>
  );
}

ConfirmationDirectScheduleInfoV2.propTypes = {
  clinic: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  facilityDetails: PropTypes.object.isRequired,
  slot: PropTypes.object.isRequired,
};
