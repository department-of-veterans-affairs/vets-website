import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { formatISO, differenceInMilliseconds } from 'date-fns';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { titleCase } from '../utils/formatters';
import ReferralLayout from './components/ReferralLayout';
import ProviderAddress from './components/ProviderAddress';
import AppointmentDate from '../components/AppointmentDate';
import AppointmentTime from '../components/AppointmentTime';
import { routeToNextReferralPage } from './flow';
import { usePollAppointmentInfoQuery } from '../redux/api/vaosApi';
import { setFormCurrentPage, startNewAppointmentFlow } from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import getNewAppointmentFlow from '../new-appointment/newAppointmentFlow';
import {
  getAppointmentCreateStatus,
  selectCurrentPage,
} from './redux/selectors';
import { FETCH_STATUS, GA_PREFIX } from '../utils/constants';
import FindCommunityCareOfficeLink from './components/FindCCFacilityLink';

function handleScheduleClick(dispatch) {
  return () => {
    recordEvent({
      event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
    });
    dispatch(startNewAppointmentFlow());
  };
}

const timeOut = 30000; // 30 seconds
const pollingInterval = 1000; // 1 second

export const CompleteReferral = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { pathname } = location;
  const appointmentCreateStatus = useSelector(getAppointmentCreateStatus);
  const currentPage = useSelector(selectCurrentPage);
  const [requestTime, setRequestTime] = useState(0);
  const requestStart = useRef(formatISO(new Date()));
  const [appointmentInfoTimeout, setAppointmentInfoTimeout] = useState(false);
  const [, appointmentId] = pathname.split('/schedule-referral/complete/');
  const { root, typeOfCare } = useSelector(getNewAppointmentFlow);

  function goToDetailsView(e) {
    e.preventDefault();
    recordEvent({
      event: `${GA_PREFIX}-view-eps-appointment-details-button-clicked`,
    });
    routeToNextReferralPage(history, currentPage, null, appointmentId);
  }

  useEffect(
    () => {
      dispatch(setFormCurrentPage('complete'));
    },
    [dispatch],
  );
  const {
    refetch: referralAppointmentRefetch,
    data: referralAppointmentInfo,
    isError: appointmentInfoError,
    isLoading: appointmentInfoLoading,
  } = usePollAppointmentInfoQuery(appointmentId);
  const [booked, setBooked] = useState(
    referralAppointmentInfo?.attributes?.status === 'booked',
  );
  useEffect(
    () => {
      let requestInterval;
      // Stop polling when appointment is booked.
      if (referralAppointmentInfo?.attributes?.status === 'booked') {
        setBooked(true);
      } else if (requestTime > timeOut && !booked) {
        // Stop polling if not booked after timeout.
        setAppointmentInfoTimeout(true);
      } else if (!booked && !appointmentInfoError) {
        // Refetch data after polling interval and increment request time.
        requestInterval = setInterval(() => {
          referralAppointmentRefetch();
          setRequestTime(
            differenceInMilliseconds(
              new Date(),
              new Date(requestStart.current),
            ),
          );
        }, pollingInterval);
      }
      return () => clearInterval(requestInterval);
    },
    [
      appointmentInfoError,
      booked,
      referralAppointmentInfo,
      referralAppointmentRefetch,
      requestTime,
    ],
  );

  if (appointmentInfoError || appointmentInfoTimeout) {
    const phoneNumber = referralAppointmentInfo?.attributes?.provider?.phone;
    const phoneText = phoneNumber ? `at ${phoneNumber} ` : '';

    return (
      <ReferralLayout
        hasEyebrow
        heading={
          appointmentInfoTimeout
            ? "We're having trouble scheduling this appointment"
            : "We can't schedule this appointment online"
        }
      >
        <va-alert
          status={appointmentInfoTimeout ? 'warning' : 'error'}
          data-testid={appointmentInfoTimeout ? 'warning-alert' : 'error-alert'}
          class="vads-u-margin-top--5"
        >
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            {appointmentInfoTimeout
              ? `Try refreshing this page. If it still doesn't work, call your community care provider ${phoneText}or your facility's community care office to schedule an appointment.`
              : `We're sorry. Call your community care provider ${phoneText}or your facility's community care office to schedule an appointment.`}
          </p>
          <FindCommunityCareOfficeLink />
        </va-alert>
      </ReferralLayout>
    );
  }

  if (
    appointmentInfoLoading ||
    !booked ||
    !referralAppointmentInfo?.attributes
  ) {
    return (
      <ReferralLayout loadingMessage="Confirming your appointment. This may take up to 30 seconds. Please don’t refresh the page." />
    );
  }

  const referralLoaded = !!referralAppointmentInfo?.attributes?.id;

  const { attributes } = referralAppointmentInfo;

  return (
    <ReferralLayout
      hasEyebrow
      heading="Your appointment is scheduled"
      apiFailure={
        appointmentInfoError &&
        appointmentCreateStatus !== FETCH_STATUS.succeeded
      }
      loadingMessage={
        appointmentInfoLoading || !referralLoaded
          ? 'Loading your appointment details'
          : null
      }
    >
      {!!referralLoaded && (
        <>
          <p>We’ve confirmed your appointment.</p>
          <div
            className="vads-u-margin-top--6 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
            data-testid="appointment-block"
          >
            <p
              className="vads-u-margin-bottom--0 vads-u-font-family--serif"
              data-testid="appointment-date-container"
            >
              <AppointmentDate
                date={attributes.start}
                timezone={attributes.provider.location.timezone}
              />
            </p>
            <h2
              className="vads-u-margin-top--0 vads-u-margin-bottom-1"
              data-testid="appointment-time-container"
            >
              <AppointmentTime
                date={attributes.start}
                timezone={attributes.provider.location.timezone}
              />
            </h2>
            <strong data-dd-privacy="mask" data-testid="appointment-type">
              {attributes?.categoryOfCare
                ? `${titleCase(attributes.categoryOfCare)} with ${attributes
                    ?.provider?.name || 'Provider name not available'}`
                : `${attributes?.provider?.name ||
                    'Provider name not available'}`}
            </strong>
            <p
              className="vads-u-margin-bottom--0"
              data-testid="appointment-modality"
            >
              Community care
            </p>
            <ProviderAddress
              address={attributes?.provider?.location?.address}
              showDirections
              directionsName={attributes?.provider?.location?.name}
              phone={attributes?.provider?.phone}
            />
            <p>
              <va-link
                href={`${root.url}/${attributes.id}?eps=true`}
                data-testid="cc-details-link"
                text="Details"
                onClick={e => goToDetailsView(e)}
              />
            </p>
          </div>
          <div className="vads-u-margin-top--2">
            <va-alert
              status="info"
              data-testid="survey-info-block"
              className="vads-u-padding--2"
            >
              <h3 className="vads-u-font-size--h4 vads-u-margin-top--0">
                Please consider taking our pilot feedback surveys
              </h3>
              <p className="vads-u-margin-top--0">
                First, follow the link below to the sign-up survey with our
                recruitment partner.
              </p>
              <p>
                Next, wait to be contacted by our recruitment partner, who will
                provide the feedback survey.
              </p>
              <p className="vads-u-margin-y--1">
                Our recruiting partner will provide compensation.
              </p>
              <p className="vads-u-margin-bottom--0">
                <va-link
                  href="https://forms.gle/7Lh5H2fab7Qv3DbA9"
                  text="Start the sign-up survey"
                  data-testid="survey-link"
                />
              </p>
            </va-alert>
          </div>
          <div className="vads-u-margin-top--6">
            <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
              Manage your appointments
            </h2>
            <hr
              aria-hidden="true"
              className="vads-u-margin-y--1p5 vads-u-border-color--primary"
            />
            <p>
              <va-link
                text="Review your appointments"
                data-testid="view-appointments-link"
                href={`${root.url}`}
              />
            </p>
            <p>
              <va-link
                text="Schedule a new appointment"
                data-testid="schedule-appointment-link"
                href={`${root.url}${typeOfCare.url}`}
                onClick={handleScheduleClick(dispatch)}
              />
            </p>
            <p>
              <va-link
                text="Review Referrals and Requests"
                data-testid="return-to-referrals-link"
                href={`${root.url}/referrals-requests`}
              />
            </p>
          </div>
        </>
      )}
    </ReferralLayout>
  );
};

export default CompleteReferral;
