import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import moment from '../../lib/moment-tz';

import { APPOINTMENT_STATUS, FETCH_STATUS } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { fetchConfirmedAppointmentDetails } from '../redux/actions';
import AppointmentDateTime from './AppointmentDateTime';
import AddToCalendar from '../../components/AddToCalendar';
import FacilityAddress from '../../components/FacilityAddress';
import PageLayout from './PageLayout';
import ErrorMessage from '../../components/ErrorMessage';
import { selectCommunityCareDetailsInfo } from '../redux/selectors';
import FullWidthLayout from '../../components/FullWidthLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import InfoAlert from '../../components/InfoAlert';
import { getCalendarData } from '../../services/appointment';
import StatusAlert from './ConfirmedAppointmentDetailsPage/StatusAlert';
import { getTypeOfCareById } from '../../utils/appointment';

export default function CommunityCareAppointmentDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { appointment, appointmentDetailsStatus, useV2 } = useSelector(state =>
    selectCommunityCareDetailsInfo(state, id),
  );
  const appointmentDate = moment.parseZone(appointment?.start);

  useEffect(() => {
    dispatch(fetchConfirmedAppointmentDetails(id, 'cc'));
  }, []);

  useEffect(
    () => {
      if (appointment && appointmentDate) {
        document.title = `Community care appointment on ${appointmentDate.format(
          'dddd, MMMM D, YYYY',
        )}`;
        scrollAndFocus();
      }
    },
    [appointment, appointmentDate],
  );

  useEffect(
    () => {
      if (
        appointmentDetailsStatus === FETCH_STATUS.failed ||
        (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
      ) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus],
  );

  if (
    appointmentDetailsStatus === FETCH_STATUS.failed ||
    (appointmentDetailsStatus === FETCH_STATUS.succeeded && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === FETCH_STATUS.loading) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const header = 'Community care';
  const { name, practiceName, providerName } =
    appointment.communityCareProvider || {};
  const calendarData = getCalendarData({
    facility: appointment.communityCareProvider,
    appointment,
  });
  const { isPastAppointment } = appointment.vaos;
  const isCanceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/cc/${id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      <StatusAlert appointment={appointment} />

      {useV2 &&
        typeOfCare && (
          <>
            <h2
              className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
              data-cy="community-care-appointment-details-header"
            >
              <div className="vads-u-display--inline">Type of care</div>
            </h2>
            <div>{typeOfCare?.name}</div>
          </>
        )}
      <h2
        className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
        data-cy="community-care-appointment-details-header"
      >
        <span>
          <strong>{header}</strong>
        </span>
      </h2>

      {/* the order of display name is important to match screen name on add to calendar title */}
      {(!!providerName || !!practiceName || !!name) &&
        !useV2 && (
          // V1 displays the name from the provider object
          <>
            {providerName || practiceName || name}
            <br />
          </>
        )}
      {(!!providerName || !!practiceName || !!name) &&
        useV2 && (
          // V2 displays the first provider name from the array
          <>
            {providerName[0] || practiceName || name}
            <br />
          </>
        )}
      <FacilityAddress
        facility={appointment.communityCareProvider}
        showDirectionsLink={!!appointment.communityCareProvider?.address}
        level={2}
      />

      <div className="vads-u-margin-top--3 vaos-appts__block-label">
        {!!appointment.comment && (
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              Special instructions
            </h2>
            <div>{appointment.comment}</div>
          </div>
        )}
      </div>

      {!isPastAppointment &&
        !isCanceled && (
          <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
            <i
              aria-hidden="true"
              className="far fa-calendar vads-u-margin-right--1 vads-u-color--link-default"
            />
            <AddToCalendar
              summary={calendarData.summary}
              description={{
                text: calendarData.text,
                phone: calendarData.phone,
                additionalText: calendarData.additionalText,
              }}
              location={calendarData.location}
              duration={appointment.minutesDuration}
              startDateTime={moment.parseZone(appointment.start)}
            />
          </div>
        )}

      <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
        <i
          aria-hidden="true"
          className="fas fa-print vads-u-margin-right--1 vads-u-color--link-default"
        />
        <button
          type="button"
          className="va-button-link"
          onClick={() => window.print()}
        >
          Print
        </button>
      </div>

      {!isPastAppointment &&
        appointment.status !== 'cancelled' && (
          <InfoAlert
            backgroundOnly
            headline="Need to make changes?"
            status="info"
          >
            Contact this provider if you need to reschedule or cancel your
            appointment.
          </InfoAlert>
        )}
    </PageLayout>
  );
}

CommunityCareAppointmentDetailsPage.propTypes = {
  useV2: PropTypes.bool,
};
