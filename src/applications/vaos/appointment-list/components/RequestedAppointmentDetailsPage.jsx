import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import * as actions from '../redux/actions';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
  QUERY_STATUS,
} from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './cards/pending/ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';
import Breadcrumbs from '../../components/Breadcrumbs';
import {
  fetchRequestById,
  getPatientTelecom,
  getVAAppointmentLocationId,
} from '../../services/appointment';
import {
  selectFirstRequestMessage,
  getCancelInfo,
  selectAppointmentById,
} from '../redux/selectors';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from './AppointmentsPage/PageLayout';
import FullWidthLayout from '../../components/FullWidthLayout';
import useFacilitiesQuery from '../../hooks/useFacilitiesQuery';
import { useQuery, useQueryClient } from 'react-query';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

function RequestedAppointmentDetailsPage({
  cancelAppointment,
  cancelInfo,
  closeCancelAppointment,
  confirmCancelAppointment,
  message,
}) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: appointment, status: appointmentDetailsStatus } = useQuery(
    ['pending', id],
    () => fetchRequestById(id),
    {
      initialData: () =>
        queryClient.getQueryData('pending')?.find(appt => appt.id === id),
    },
  );

  const facilityId = getVAAppointmentLocationId(appointment);
  const { facilityData } = useFacilitiesQuery(facilityId);

  useEffect(
    () => {
      if (appointment) {
        const isCanceled = appointment.status === APPOINTMENT_STATUS.cancelled;
        const isCC = appointment.vaos.isCommunityCare;
        const typeOfCareText = lowerCase(
          appointment?.type?.coding?.[0]?.display,
        );

        const title = `${isCanceled ? 'Canceled' : 'Pending'} ${
          isCC ? 'Community care' : 'VA'
        } ${typeOfCareText} appointment`;

        document.title = title;
      }
      scrollAndFocus();
    },
    [appointment],
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
        appointmentDetailsStatus === QUERY_STATUS.error ||
        (appointmentDetailsStatus === QUERY_STATUS.success && !appointment)
      ) {
        scrollAndFocus();
      }
    },
    [appointmentDetailsStatus],
  );

  if (
    appointmentDetailsStatus === QUERY_STATUS.error ||
    (appointmentDetailsStatus === QUERY_STATUS.success && !appointment)
  ) {
    return (
      <FullWidthLayout>
        <ErrorMessage level={1} />
      </FullWidthLayout>
    );
  }

  if (!appointment || appointmentDetailsStatus === QUERY_STATUS.loading) {
    return (
      <FullWidthLayout>
        <LoadingIndicator
          setFocus
          message="Loading your appointment request..."
        />
      </FullWidthLayout>
    );
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isCC = appointment.vaos.isCommunityCare;
  const isVideoRequest = appointment.vaos.isVideo;
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const facility = facilityData?.[facilityId];
  const isCCRequest =
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const provider = appointment.preferredCommunityCareProviders?.[0];

  return (
    <PageLayout>
      <Breadcrumbs>
        <Link to={`/requests/${id}`}>Request detail</Link>
      </Breadcrumbs>

      <h1>
        {canceled ? 'Canceled' : 'Pending'} {typeOfCareText} appointment
      </h1>
      <AlertBox
        status={canceled ? 'error' : 'info'}
        className="vads-u-display--block vads-u-margin-bottom--2"
        backgroundOnly
      >
        {canceled && 'This request has been canceled'}
        {!canceled && (
          <>
            Your appointment request has been submitted. We will review your
            request and contact you to schedule the first available appointment.
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--2">
              <i
                aria-hidden="true"
                className="fas fa-times vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-right--1"
              />

              <button
                aria-label="Cancel request"
                className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
                onClick={() => cancelAppointment(appointment)}
              >
                Cancel Request
              </button>
            </div>
          </>
        )}
      </AlertBox>
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
        {!isCCRequest && isVideoRequest && 'VA Video Connect'}
        {!isCCRequest && !isVideoRequest && 'VA Appointment'}
      </h2>

      {!!facility &&
        !isCC && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isHomepageRefresh
          />
        )}

      {isCCRequest && (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred community care provider
          </h2>
          {!!provider && (
            <span>{provider.provideName || provider.practiceName}</span>
          )}
          {!provider && <span>No provider selected</span>}
        </>
      )}

      <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
        Preferred date and time
      </h2>
      <ul className="usa-unstyled-list">
        {appointment.requestedPeriod.map((option, optionIndex) => (
          <li key={`${appointment.id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {option.start.includes('00:00:00') ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <>
        <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
          {appointment.reason}
        </h2>
        <div>{message}</div>
      </>
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
        Your contact details
      </h2>
      <div>
        {getPatientTelecom(appointment, 'email')}
        <br />
        {getPatientTelecom(appointment, 'phone')}
        <br />
        <span className="vads-u-font-style--italic">
          <ListBestTimeToCall
            timesToCall={appointment.legacyVAR?.bestTimeToCall}
          />
        </span>
      </div>
      <Link to="/requested">
        <button className="usa-button vads-u-margin-top--2">
          « Go back to appointments
        </button>
      </Link>
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
      APPOINTMENT_TYPES.request,
      APPOINTMENT_TYPES.ccRequest,
    ]),
    appointmentDetailsStatus,
    facilityData,
    message: selectFirstRequestMessage(state, ownProps.match.params.id),
    cancelInfo: getCancelInfo(state),
  };
}
const mapDispatchToProps = {
  cancelAppointment: actions.cancelAppointment,
  closeCancelAppointment: actions.closeCancelAppointment,
  confirmCancelAppointment: actions.confirmCancelAppointment,
  fetchRequestDetails: actions.fetchRequestDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestedAppointmentDetailsPage);
