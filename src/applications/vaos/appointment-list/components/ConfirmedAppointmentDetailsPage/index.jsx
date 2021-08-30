import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import AddToCalendar from '../../../components/AddToCalendar';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import moment from '../../../lib/moment-tz';
import {
  getVAAppointmentLocationId,
  isVAPhoneAppointment,
  isVideoHome,
  getCalendarData,
  isClinicVideoAppointment,
} from '../../../services/appointment';
import {
  APPOINTMENT_STATUS,
  FETCH_STATUS,
  GA_PREFIX,
  PURPOSE_TEXT,
  VIDEO_TYPES,
} from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import AppointmentDateTime from '../AppointmentDateTime';
import VideoVisitSection from './VideoVisitSection';
import PageLayout from '../AppointmentsPage/PageLayout';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import Breadcrumbs from '../../../components/Breadcrumbs';
import InfoAlert from '../../../components/InfoAlert';
import {
  startAppointmentCancel,
  closeCancelAppointment,
  confirmCancelAppointment,
  fetchConfirmedAppointmentDetails,
} from '../../redux/actions';
import { getConfirmedAppointmentDetailsInfo } from '../../redux/selectors';
import DetailsVA from './DetailsVA';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

function formatHeader(appointment) {
  if (appointment.videoData.kind === VIDEO_TYPES.gfe) {
    return 'VA Video Connect using VA device';
  } else if (isClinicVideoAppointment(appointment)) {
    return 'VA Video Connect at VA location';
  } else if (appointment.videoData.isAtlas) {
    return 'VA Video Connect at an ATLAS location';
  } else if (isVideoHome(appointment)) {
    return 'VA Video Connect at home';
  } else if (isVAPhoneAppointment(appointment)) {
    return 'VA appointment over the phone';
  } else if (appointment.vaos.isCOVIDVaccine) {
    return 'COVID-19 vaccine';
  } else {
    return 'VA appointment';
  }
}

export default function ConfirmedAppointmentDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const showConfirmMsg = queryParams.get('confirmMsg');
  const {
    appointment,
    appointmentDetailsStatus,
    cancelInfo,
    facilityData,
    showCancelButton,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const appointmentDate = moment.parseZone(appointment?.start);
  const locationId = getVAAppointmentLocationId(appointment);

  useEffect(() => {
    dispatch(fetchConfirmedAppointmentDetails(id, 'va'));

    scrollAndFocus();
  }, []);

  useEffect(
    () => {
      if (appointment && appointmentDate) {
        document.title = `VA appointment on ${appointmentDate.format(
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
        !cancelInfo.showCancelModal &&
        cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded
      ) {
        scrollAndFocus();
      }
    },
    [cancelInfo.showCancelModal, cancelInfo.cancelAppointmentStatus],
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
        <LoadingIndicator setFocus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  if (
    appointment.vaos.isCOVIDVaccine ||
    appointment.vaos.isPhoneAppointment ||
    !appointment.vaos.isVideo
  ) {
    return (
      <>
        <DetailsVA appointment={appointment} facilityData={facilityData} />
        <CancelAppointmentModal
          {...cancelInfo}
          onConfirm={() => dispatch(confirmCancelAppointment())}
          onClose={() => dispatch(closeCancelAppointment())}
        />
      </>
    );
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isVideo = appointment.vaos.isVideo;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const facility = facilityData?.[locationId];
  const isInPersonVAAppointment = !isVideo;
  const isCovid = appointment.vaos.isCOVIDVaccine;
  const canceler = appointment.description?.includes('CANCELLED BY PATIENT')
    ? 'You'
    : facility?.name || 'Facility';

  const header = formatHeader(appointment);

  const showInstructions =
    isInPersonVAAppointment &&
    PURPOSE_TEXT.some(purpose =>
      appointment?.comment?.startsWith(purpose.short),
    );

  const calendarData = getCalendarData({
    appointment,
    facility: facilityData[locationId],
  });

  let infoAlert = null;
  if (canceled) {
    infoAlert = (
      <InfoAlert status="error" backgroundOnly>
        {`${canceler} canceled this appointment.`}
      </InfoAlert>
    );
  } else if (isPastAppointment) {
    infoAlert = (
      <InfoAlert status="warning" backgroundOnly>
        This appointment occurred in the past.
      </InfoAlert>
    );
  } else if (showConfirmMsg) {
    infoAlert = (
      <InfoAlert backgroundOnly status="success">
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
    );
  }

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/va/${id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime appointment={appointment} />
      </h1>

      {infoAlert}

      <h2
        className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0"
        data-cy={
          isVideo
            ? 'va-video-appointment-details-header'
            : 'va-appointment-details-header'
        }
      >
        {header}
      </h2>

      {isVideo && (
        <VideoVisitSection
          header={header}
          facility={facility}
          appointment={appointment}
        />
      )}

      {!isVideo && (
        <>
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={locationId}
            isHomepageRefresh
            clinicFriendlyName={appointment.location?.clinicName}
            showCovidPhone={isCovid}
          />

          {showInstructions && (
            <div className="vads-u-margin-top--3 vaos-appts__block-label">
              <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
                <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
                  You shared these details about your concern
                </h2>
                <div>{appointment.comment}</div>
              </div>
            </div>
          )}
          {!canceled && (
            <>
              {!isPastAppointment && (
                <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="far fa-calendar vads-u-margin-right--1 vads-u-color--link-default"
                  />
                  <AddToCalendar
                    summary={calendarData.summary}
                    description={{
                      text: calendarData.text,
                      providerName: calendarData.providerName,
                      phone: calendarData.phone,
                      additionalText: calendarData.additionalText,
                    }}
                    location={calendarData.location}
                    duration={appointment.minutesDuration}
                    startDateTime={appointment.start}
                  />
                </div>
              )}
              <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                <i
                  aria-hidden="true"
                  className="fas fa-print vads-u-margin-right--1 vads-u-color--link-default"
                />
                <button
                  className="va-button-link"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              </div>

              {showCancelButton &&
                (!isPastAppointment && !isCovid) && (
                  <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                    <i
                      aria-hidden="true"
                      className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg vads-u-color--link-default"
                    />
                    <button
                      onClick={() =>
                        dispatch(startAppointmentCancel(appointment))
                      }
                      aria-label={`Cancel appointment on ${formatAppointmentDate(
                        moment.parseZone(appointment.start),
                      )}`}
                      className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
                    >
                      Cancel appointment
                      <span className="sr-only">
                        {' '}
                        on{' '}
                        {formatAppointmentDate(
                          moment.parseZone(appointment.start),
                        )}
                      </span>
                    </button>
                  </div>
                )}

              {isCovid && (
                <InfoAlert
                  status="info"
                  headline="Need to make changes?"
                  backgroundOnly
                >
                  Contact this provider if you need to reschedule or cancel your
                  appointment.
                </InfoAlert>
              )}
            </>
          )}
        </>
      )}
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={() => dispatch(confirmCancelAppointment())}
        onClose={() => dispatch(closeCancelAppointment())}
      />
    </PageLayout>
  );
}
