import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  VaAlert,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import BackLink from '../../components/BackLink';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import ListBestTimeToCall from './ListBestTimeToCall';
import VAFacilityLocation from '../../components/VAFacilityLocation';
import { selectRequestedAppointmentDetails } from '../redux/selectors';
import {
  selectFeatureAppointmentDetailsRedesign,
  selectFeatureBreadcrumbUrlUpdate,
  selectFeatureVAOSServiceCCAppointments,
} from '../../redux/selectors';
import ErrorMessage from '../../components/ErrorMessage';
import PageLayout from './PageLayout';
import FullWidthLayout from '../../components/FullWidthLayout';
import { startAppointmentCancel, fetchRequestDetails } from '../redux/actions';
import RequestedStatusAlert from './RequestedStatusAlert';
import CancelWarningPage from './cancel/CancelWarningPage';
import CancelConfirmationPage from './cancel/CancelConfirmationPage';
import CancelAppointmentModal from './cancel/CancelAppointmentModal';
import { FETCH_STATUS, GA_PREFIX } from '../../utils/constants';
import FacilityAddress from '../../components/FacilityAddress';
import FacilityPhone from '../../components/FacilityPhone';
import VARequestLayout from '../../components/layout/VARequestLayout';
import CCRequestLayout from '../../components/layout/CCRequestLayout';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

function Content() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    appointment,
    bookingNotes,
    canceled,
    email,
    facility,
    facilityId,
    isCC,
    isCCRequest,
    phone,
    preferredDates,
    preferredTimesForPhoneCall,
    provider,
    typeOfCare,
    typeOfCareText,
    typeOfVisit,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
  );
  const featureVAOSServiceCCAppointments = useSelector(
    selectFeatureVAOSServiceCCAppointments,
  );

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
          {featureVAOSServiceCCAppointments &&
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
        {preferredDates.map((option, optionIndex) => (
          <li key={`${id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <div className="vaos-u-word-break--break-word" data-dd-privacy="mask">
        <h2 className="vads-u-margin-top--2 vaos-appts__block-label">
          You shared these details about your concern
        </h2>
        {bookingNotes}
      </div>
      <div>
        <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0 vaos-appts__block-label">
          Your contact details
        </h2>
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Email:{' '}
        </h3>
        <span data-dd-privacy="mask">{email}</span>
        <br />
        <h3 className="vads-u-font-family--sans vads-u-display--inline vads-u-font-size--base">
          Phone number:{' '}
        </h3>
        <VaTelephone
          data-dd-privacy="mask"
          notClickable
          contact={phone}
          data-testid="patient-telephone"
        />
        <br />
        <ListBestTimeToCall timesToCall={preferredTimesForPhoneCall} />
      </div>
      <div className="vaos-u-word-break--break-word">
        {!canceled && (
          <>
            <div className="vads-u-margin-top--3 vaos-hide-for-print">
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
                <span className="vads-u-margin-right--0p5">
                  <va-icon icon="cancel" size="3" aria-hidden="true" />
                </span>
                Cancel Request
              </button>
            </div>
          </>
        )}
      </div>
      {!featureAppointmentDetailsRedesign && <CancelAppointmentModal />}
    </PageLayout>
  );
}

export default function RequestedAppointmentDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(fetchRequestDetails(id));
    },
    [dispatch, id],
  );

  const {
    appointment,
    appointmentDetailsStatus,
    cancelInfo,
    facility,
    facilityPhone,
    isCC,
    isCanceled,
    typeOfCareText,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const featureAppointmentDetailsRedesign = useSelector(
    selectFeatureAppointmentDetailsRedesign,
  );

  useEffect(
    () => {
      if (appointment) {
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
    [
      dispatch,
      typeOfCareText,
      featureBreadcrumbUrlUpdate,
      isCanceled,
      isCC,
      appointment,
    ],
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

  if (!featureAppointmentDetailsRedesign) {
    return <Content />;
  }

  if (featureAppointmentDetailsRedesign) {
    if (isCC && cancelInfo.showCancelModal === false) {
      return <CCRequestLayout data={appointment} />;
    }
    if (isCC === false && cancelInfo.showCancelModal === false) {
      return <VARequestLayout data={appointment} />;
    }
    if (
      cancelInfo.cancelAppointmentStatus === FETCH_STATUS.notStarted ||
      cancelInfo.cancelAppointmentStatus === FETCH_STATUS.loading
    ) {
      return (
        <PageLayout showNeedHelp>
          <CancelWarningPage
            {...{
              appointment,
              cancelInfo,
            }}
          />
        </PageLayout>
      );
    }
    if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.succeeded) {
      return (
        <PageLayout showNeedHelp>
          <CancelConfirmationPage
            {...{
              appointment,
              cancelInfo,
            }}
          />
        </PageLayout>
      );
    }
    if (cancelInfo.cancelAppointmentStatus === FETCH_STATUS.failed) {
      return (
        <PageLayout showNeedHelp>
          <BackLink appointment={appointment} />
          <div className="vads-u-margin-y--2p5">
            <VaAlert status="error" visible>
              <h2 slot="headline">We couldn’t cancel your request</h2>
              <p>
                Something went wrong when we tried to cancel this request.
                Please contact your medical center to cancel:
                <br />
                <br />
                {isCC && (
                  <>
                    <strong>{facility?.name}</strong>
                    <br />
                    <FacilityAddress
                      facility={facility}
                      showPhone
                      phoneHeading="Facility phone:"
                    />
                  </>
                )}
                {!!facility &&
                  !isCC && (
                    <>
                      <VAFacilityLocation
                        facility={facility}
                        facilityName={facility?.name}
                        facilityId={facility?.id}
                        showDirectionsLink={false}
                        showPhone={false}
                      />
                      <br />
                      <FacilityPhone contact={facilityPhone} level={3} />
                    </>
                  )}
              </p>
            </VaAlert>
          </div>
        </PageLayout>
      );
    }
  }
}
