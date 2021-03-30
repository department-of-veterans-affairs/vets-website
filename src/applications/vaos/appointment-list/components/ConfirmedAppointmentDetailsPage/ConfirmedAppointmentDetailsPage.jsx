import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import CancelAppointmentModal from '../cancel/CancelAppointmentModal';
import AddToCalendar from '../../../components/AddToCalendar';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import moment from '../../../lib/moment-tz';
import {
  getVAAppointmentLocationId,
  getVARFacilityId,
  isVAPhoneAppointment,
  isVideoHome,
} from '../../../services/appointment';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
  PURPOSE_TEXT,
  VIDEO_TYPES,
} from '../../../utils/constants';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import * as actions from '../../redux/actions';
import AppointmentDateTime from './AppointmentDateTime';
import { getCancelInfo, selectAppointmentById } from '../../redux/selectors';
import { selectFeatureCancel } from '../../../redux/selectors';
import VideoVisitSection from './VideoVisitSection';
import { getVideoInstructionText } from './VideoInstructions';
import { formatFacilityAddress } from 'applications/vaos/services/location';
import PageLayout from '../AppointmentsPage/PageLayout';
import ErrorMessage from '../../../components/ErrorMessage';
import FullWidthLayout from '../../../components/FullWidthLayout';
import Breadcrumbs from '../../../components/Breadcrumbs';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

function formatHeader(appointment) {
  if (appointment.videoData.kind === VIDEO_TYPES.gfe) {
    return 'VA Video Connect using VA device';
  } else if (appointment.videoData.kind === VIDEO_TYPES.clinic) {
    return 'VA Video Connect at VA location';
  } else if (appointment.videoData.isAtlas) {
    return 'VA Video Connect at an ATLAS location';
  } else if (isVideoHome(appointment)) {
    return 'VA Video Connect at home';
  } else if (isVAPhoneAppointment(appointment)) {
    return 'VA Appointment over the phone';
  } else {
    return 'VA Appointment';
  }
}

function formatInstructions(instructions) {
  if (!instructions) {
    return null;
  }

  const strParts = instructions.split(': ');

  if (strParts[0] && strParts[1]) {
    return {
      header: strParts[0],
      body: strParts[1],
    };
  }

  return null;
}

function ConfirmedAppointmentDetailsPage({
  appointment,
  appointmentDetailsStatus,
  cancelAppointment,
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  facilityData,
  fetchConfirmedAppointmentDetails,
  showCancelButton,
}) {
  const { id } = useParams();
  const appointmentDate = moment.parseZone(appointment?.start);

  useEffect(() => {
    fetchConfirmedAppointmentDetails(id, 'va');

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

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isVideo = appointment.vaos.isVideo;
  const videoKind = appointment.videoData.kind;
  const isPhone = isVAPhoneAppointment(appointment);
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const isInPersonVAAppointment = !isVideo;

  const header = formatHeader(appointment);
  const instructions = formatInstructions(appointment.comment);

  const showInstructions =
    isInPersonVAAppointment &&
    PURPOSE_TEXT.some(purpose =>
      appointment?.comment?.startsWith(purpose.short),
    );

  const showVideoInstructions =
    isVideo &&
    appointment.comment &&
    videoKind !== VIDEO_TYPES.clinic &&
    videoKind !== VIDEO_TYPES.gfe;

  let calendarDescription = 'VA appointment';
  if (showInstructions) {
    calendarDescription = appointment.comment;
  } else if (showVideoInstructions) {
    calendarDescription = getVideoInstructionText(appointment.comment);
  } else if (isVideo) {
    calendarDescription = 'VA video appointment';
  }

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/va/${id}`}>Appointment detail</Link>
      </Breadcrumbs>

      <h1>
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          facilityId={getVARFacilityId(appointment)}
        />
      </h1>

      {canceled && (
        <AlertBox
          status="error"
          className="vads-u-display--block vads-u-margin-bottom--2"
          backgroundOnly
        >
          This appointment has been canceled
        </AlertBox>
      )}

      {isVideo && (
        <>
          <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
            {header}
          </h2>
          <VideoVisitSection
            header={header}
            facility={facility}
            appointment={appointment}
          />
        </>
      )}

      {!!facility &&
        !isVideo && (
          <>
            <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
              {header}
            </h2>
            <VAFacilityLocation
              facility={facility}
              facilityName={facility?.name}
              facilityId={facilityId}
              isHomepageRefresh
              clinicFriendlyName={appointment.participant[0].actor.display}
            />

            {showInstructions &&
              isInPersonVAAppointment &&
              instructions && (
                <div className="vads-u-margin-top--3 vaos-appts__block-label">
                  <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
                    <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
                      {instructions.header}
                    </h2>
                    <div>{instructions.body}</div>
                  </div>
                </div>
              )}
            {!canceled && (
              <>
                <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="far fa-calendar vads-u-margin-right--1"
                  />
                  <AddToCalendar
                    summary={`${header}`}
                    description={calendarDescription}
                    location={
                      isPhone ? 'Phone call' : formatFacilityAddress(facility)
                    }
                    duration={appointment.minutesDuration}
                    startDateTime={appointment.start}
                  />
                </div>

                <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="fas fa-print vads-u-margin-right--1"
                  />
                  <button
                    className="va-button-link"
                    onClick={() => window.print()}
                  >
                    Print
                  </button>
                </div>

                <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                  <i
                    aria-hidden="true"
                    className="fas fa-clock vads-u-margin-right--1"
                  />
                  <a href="#">Reschedule</a>
                </div>

                {showCancelButton && (
                  <div className="vads-u-margin-top--2 vaos-appts__block-label vaos-hide-for-print">
                    <i
                      aria-hidden="true"
                      className="fas fa-times vads-u-margin-right--1 vads-u-font-size--lg"
                    />
                    <button
                      onClick={() => cancelAppointment(appointment)}
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
              </>
            )}
          </>
        )}

      <div className="vads-u-margin-top--3 vaos-appts__block-label vaos-hide-for-print">
        <Link to="/" className="usa-button vads-u-margin-top--2" role="button">
          « Go back to appointments
        </Link>
      </div>
      <CancelAppointmentModal
        {...cancelInfo}
        onConfirm={confirmCancelAppointment}
        onClose={closeCancelAppointment}
      />
    </PageLayout>
  );
}

function mapStateToProps(state, ownProps) {
  const { appointmentDetailsStatus, facilityData } = state.appointments;

  return {
    appointment: selectAppointmentById(state, ownProps.match.params.id, [
      APPOINTMENT_TYPES.vaAppointment,
    ]),
    appointmentDetailsStatus,
    cancelInfo: getCancelInfo(state),
    facilityData,
    showCancelButton: selectFeatureCancel(state),
  };
}

const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  fetchConfirmedAppointmentDetails: actions.fetchConfirmedAppointmentDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmedAppointmentDetailsPage);
