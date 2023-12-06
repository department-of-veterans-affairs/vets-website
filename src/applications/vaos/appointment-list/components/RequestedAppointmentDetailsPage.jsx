import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from 'platform/monitoring/record-event';
import BackLink from '../../components/BackLink';
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  FETCH_STATUS,
  GA_PREFIX,
} from '../../utils/constants';
import { lowerCase } from '../../utils/formatters';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';
import {
  getPatientTelecom,
  getVAAppointmentLocationId,
} from '../../services/appointment';
import { selectRequestedAppointmentDetails } from '../redux/selectors';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from './PageLayout';
import FullWidthLayout from '../../components/FullWidthLayout';
import { startAppointmentCancel, fetchRequestDetails } from '../redux/actions';
import RequestedStatusAlert from './RequestedStatusAlert';
import { getTypeOfCareById } from '../../utils/appointment';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

function getAppointmentDetails(appointment, message) {
  if (appointment.version === 2) {
    return appointment.comment ? appointment.comment : 'none';
  }

  const comment = message || appointment.comment;
  if (appointment.vaos.isCommunityCare) {
    return comment || 'none';
  }
  return appointment.reason && comment
    ? `${appointment.reason}: ${comment}`
    : comment || (appointment.reason ? appointment.reason : null);
}

export default function RequestedAppointmentDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    appointmentDetailsStatus,
    facilityData,
    appointment,
    message,
    useV2,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  useEffect(
    () => {
      dispatch(fetchRequestDetails(id));
    },
    [dispatch, id],
  );
  useEffect(
    () => {
      if (appointment) {
        const isCanceled = appointment.status === APPOINTMENT_STATUS.cancelled;
        const isCC = appointment.vaos.isCommunityCare;
        const typeOfCareText = lowerCase(
          appointment?.type?.coding?.[0]?.display,
        );
        let title = `${isCanceled ? 'Canceled' : 'Pending'} ${
          isCC ? 'Community care' : 'VA'
        } ${typeOfCareText} appointment`;

        if (featureBreadcrumbUrlUpdate) {
          title = title.concat(` | Veterans Affairs`);
        }

        document.title = title;
      }
      scrollAndFocus();
    },
    [appointment, dispatch],
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

    [appointmentDetailsStatus, appointment],
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
        <va-loading-indicator
          set-focus
          message="Loading your appointment request..."
        />
      </FullWidthLayout>
    );
  }

  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isCC = appointment.vaos.isCommunityCare;
  const typeOfVisit = appointment.requestVisitType;
  const typeOfCareText = lowerCase(appointment?.type?.coding?.[0]?.display);
  const facilityId = getVAAppointmentLocationId(appointment);
  const facility = facilityData?.[facilityId];
  const isCCRequest =
    appointment.vaos.appointmentType === APPOINTMENT_TYPES.ccRequest;
  const provider = useV2
    ? appointment.preferredProviderName
    : appointment.preferredCommunityCareProviders?.[0];
  const typeOfCare = getTypeOfCareById(appointment.vaos.apiData.serviceType);

  return (
    <PageLayout>
      <BackLink appointment={appointment} />
      <h1 className="vads-u-margin-y--2p5">
        {canceled ? 'Canceled' : 'Pending'} {typeOfCareText} appointment
      </h1>
      <RequestedStatusAlert appointment={appointment} facility={facility} />
      {!isCCRequest && (
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
          VA appointment
        </h2>
      )}

      {!!facility &&
        !isCC && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
          />
        )}

      {isCCRequest ? (
        <>
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
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred community care provider
          </h2>
          {!!provider && (
            <span>
              {provider.name ||
                (provider.providerName || provider.practiceName)}
            </span>
          )}
          {!provider && <span>No provider selected</span>}
        </>
      ) : (
        <>
          <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
            Preferred type of appointment
          </h2>
          {typeOfVisit}
        </>
      )}

      <h2 className="vaos-appts__block-label vads-u-margin-bottom--0 vads-u-margin-top--2">
        Preferred date and time
      </h2>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul className="usa-unstyled-list" role="list">
        {appointment.requestedPeriod.map((option, optionIndex) => (
          <li key={`${appointment.id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <div className="vaos-u-word-break--break-word">
        <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
          You shared these details about your concern
        </h2>
        {getAppointmentDetails(appointment, message)}
      </div>
      <div>
        <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
          Your contact details
        </h2>
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Email:{' '}
        </h3>
        <span>{getPatientTelecom(appointment, 'email')}</span>
        <br />
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Phone number:{' '}
        </h3>
        <VaTelephone
          notClickable
          contact={getPatientTelecom(appointment, 'phone')}
          data-testid="patient-telephone"
        />
        <br />
        <ListBestTimeToCall
          timesToCall={appointment.preferredTimesForPhoneCall}
        />
      </div>
      <div className="vaos-u-word-break--break-word">
        {!canceled && (
          <>
            <div className="vads-u-display--flex vads-u-align-items--center vads-u-color--link-default vads-u-margin-top--3 vaos-hide-for-print">
              <i
                aria-hidden="true"
                className="fas fa-times vads-u-font-size--lg vads-u-font-weight--bold vads-u-margin-right--1"
              />
              <button
                type="button"
                aria-label="Cancel request"
                className="vaos-appts__cancel-btn va-button-link vads-u-flex--0"
                onClick={() => {
                  recordEvent({
                    event: `${GA_PREFIX}-cancel-request-clicked`,
                  });
                  dispatch(startAppointmentCancel(appointment));
                }}
              >
                Cancel Request
              </button>
            </div>
          </>
        )}
      </div>
      <CancelAppointmentModal />
    </PageLayout>
  );
}
