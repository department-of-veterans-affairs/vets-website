import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import moment from '../../lib/moment-tz';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneByFacilityId } from '../../utils/timezone';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import { selectConfirmationPage } from '../redux/selectors';
import AddToCalendar from '../../components/AddToCalendar';
import InfoAlert from '../../components/InfoAlert';
import {
  formatFacilityAddress,
  getFacilityPhone,
} from '../../services/location';
import AppointmentDate from '../../new-appointment/components/ReviewPage/AppointmentDate';
import { startNewAppointmentFlow } from '../redux/actions';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import getNewAppointmentFlow from '../../new-appointment/newAppointmentFlow';

const pageTitle = 'We’ve scheduled your appointment';

function handleClick(history, dispatch, typeOfCare) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
    history.push(typeOfCare.url);
  };
}

function ConfirmationPageV2({
  clinic,
  data,
  facilityDetails,
  slot,
  submitStatus,
  changeCrumb,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  if (submitStatus !== FETCH_STATUS.succeeded) {
    return <Redirect to="/" />;
  }

  const timezone = getTimezoneByFacilityId(data.vaFacility);
  const momentDate = timezone
    ? moment(slot.start).tz(timezone, true)
    : moment(slot.start);

  const appointmentLength = moment(slot.end).diff(slot.start, 'minutes');
  return (
    <div>
      <AppointmentDate
        classes="vads-u-font-size--h2"
        dates={[slot.start]}
        facilityId={data.vaFacility}
        level="1"
      />
      <InfoAlert status="success" backgroundOnly>
        <strong>We’ve scheduled and confirmed your appointment.</strong>
        <br />
        <div className="vads-u-margin-y--1">
          <va-link
            href={root.url}
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
            data-testid="schedule-appointment-link"
            onClick={handleClick(history, dispatch, typeOfCare)}
            role="link"
          />
        </div>
      </InfoAlert>
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-display--inline-block">
        Type of care:
      </h2>
      <div className="vads-u-display--inline"> COVID-19 vaccine</div>

      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
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
            clinicFriendlyName={clinic?.serviceName}
            showCovidPhone
          />
        </div>
      </div>

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
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
        <va-icon icon="print" size="3" aria-hidden="true" />
        <button
          type="button"
          className="va-button-link"
          onClick={() => window.print()}
        >
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

ConfirmationPageV2.propTypes = {
  changeCrumb: PropTypes.func,
  clinic: PropTypes.object,
  data: PropTypes.object,
  facilityDetails: PropTypes.object,
  slot: PropTypes.object,
  submitStatus: PropTypes.string,
};
