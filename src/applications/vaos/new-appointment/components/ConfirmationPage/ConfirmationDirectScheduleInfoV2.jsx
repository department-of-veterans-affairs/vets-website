import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
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
import getNewAppointmentFlow from '../../newAppointmentFlow';

function handleClick(dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
  };
}

export default function ConfirmationDirectScheduleInfoV2({
  data,
  facilityDetails,
  clinic,
  slot,
}) {
  const dispatch = useDispatch();
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  const timezone = getTimezoneByFacilityId(data.vaFacility);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone, true)
    : moment(slot.start);
  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  const typeOfCareName = getTypeOfCareById(data.typeOfCareId)?.name;
  return (
    <>
      <h1 className="vaos__dynamic-font-size--h2">
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
            data-testid="schedule-new-appointment-link"
            onClick={handleClick(dispatch)}
            href={`${root.url}${typeOfCare.url}`}
          />
        </div>
      </InfoAlert>
      {typeOfCareName && (
        <>
          <h2 className="vads-u-margin-bottom--0 vads-u-display--inline-block">
            Type of care:
          </h2>
          <div className="vads-u-display--inline"> {typeOfCareName}</div>
        </>
      )}
      <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <h2
            className="vads-u-margin-bottom--0"
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
          <h3 className="vads-u-margin-bottom--0">
            Your reason for your visit
          </h3>
          <div data-dd-privacy="mask">
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
        <va-icon icon="print" size="3" aria-hidden="true" />
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
