import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { useGetAppointmentInfoQuery } from '../../../redux/api/vaosApi';
import { setFormCurrentPage } from '../../../referral-appointments/redux/actions';
import { selectFeatureCommunityCareCancellations } from '../../../redux/selectors';

// eslint-disable-next-line import/no-restricted-paths
import PageLayout from '../../components/PageLayout';
import FullWidthLayout from '../../../components/FullWidthLayout';
import EpsAppointmentDetailCard from './EpsAppointmentDetailCard';
import EpsCancellationLayout from '../../../components/layouts/EpsCancellationLayout';

export default function EpsAppointmentDetailsPage() {
  const [cancelAppointment, setCancelAppointment] = useState({
    id: '',
    error: null,
    confirmed: false,
    loading: false,
  });
  const { pathname } = useLocation();
  // get the id from the url my-health/appointments/1234
  const [, appointmentId] = pathname.split('/');
  const history = useHistory();
  const dispatch = useDispatch();
  const featureCommunityCareCancellations = useSelector(
    selectFeatureCommunityCareCancellations,
  );

  useEffect(
    () => {
      dispatch(setFormCurrentPage('details'));
    },
    [dispatch],
  );
  const {
    data: referralAppointmentInfo,
    isError,
    isLoading,
  } = useGetAppointmentInfoQuery(appointmentId);

  if (isError) {
    return (
      <PageLayout showNeedHelp>
        <br />
        <div aria-atomic="true" aria-live="assertive">
          <va-alert
            status="error"
            data-testid="error-alert"
            class="vads-u-margin-bottom--2"
          >
            <h3>We’re sorry, we can’t find your appointment</h3>
            <p>
              Try searching this appointment on your appointment list or call
              your your facility.
            </p>
            <p className="vads-u-margin-y--0p5">
              <va-link
                data-testid="view-claim-link"
                href="/my-health/appointments"
                text="Go to appointments"
              />
            </p>
          </va-alert>
        </div>
      </PageLayout>
    );
  }
  if (isLoading || !referralAppointmentInfo?.attributes) {
    return (
      <FullWidthLayout>
        <va-loading-indicator set-focus message="Loading your appointment..." />
      </FullWidthLayout>
    );
  }

  const { attributes: appointment } = referralAppointmentInfo;
  const isPastAppointment = appointment.past;

  const backLink = isPastAppointment
    ? '/my-health/appointments/past'
    : '/my-health/appointments';

  const backLinkText = isPastAppointment
    ? 'Back to past appointments'
    : 'Back to appointments';

  const pageTitle = isPastAppointment
    ? 'Past community care appointment'
    : 'Community care appointment';

  // if (cancelAppointment.id && !cancelAppointment.confirmed) {
  //   return <div>Cancel appointment confirm page</div>;
  // }

  // if (cancelAppointment.id && cancelAppointment.confirmed) {
  //   return <div>Cancel appointment success page</div>;
  // }

  return (
    <PageLayout showNeedHelp>
      <div className="vaos-hide-for-print mobile:vads-u-margin-bottom--0 mobile-lg:vads-u-margin-bottom--1 medium-screen:vads-u-margin-bottom--2">
        <nav aria-label="backlink" className="vads-u-padding-y--2 ">
          <va-link
            back
            aria-label="Back link"
            data-testid="back-link"
            text={backLinkText}
            href={backLink}
            onClick={e => {
              e.preventDefault();
              history.push(isPastAppointment ? '/past' : '/');
            }}
          />
        </nav>
      </div>
      {cancelAppointment.id && featureCommunityCareCancellations ? (
        <EpsCancellationLayout
          cancellationConfirmed={cancelAppointment.confirmed}
          onConfirmCancellation={() =>
            // TODO: Add API call to cancel appointment
            setCancelAppointment(prev => ({ ...prev, confirmed: true }))
          }
          onAbortCancellation={() =>
            setCancelAppointment(prev => ({ ...prev, id: '' }))
          }
        />
      ) : (
        <EpsAppointmentDetailCard
          appointment={appointment}
          pageTitle={pageTitle}
          isPastAppointment={!!isPastAppointment}
          featureCommunityCareCancellations={featureCommunityCareCancellations}
          onSetCancelAppointment={() =>
            setCancelAppointment(prev => ({ ...prev, id: appointment.id }))
          }
        />
      )}
    </PageLayout>
  );
}
