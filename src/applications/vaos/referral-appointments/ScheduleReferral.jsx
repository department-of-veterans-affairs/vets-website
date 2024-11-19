import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import ReferralAppLink from './components/ReferralAppLink';
import { setFormCurrentPage } from './redux/actions';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { useGetReferralFromId } from './hooks/useGetReferralFromId';

export default function ScheduleReferral() {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { currentReferral, referralFetchStatus } = useGetReferralFromId(id);
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleReferral'));
    },
    [location, dispatch],
  );
  useEffect(
    () => {
      if (referralFetchStatus === FETCH_STATUS.succeeded) {
        scrollAndFocus('h1');
      } else if (referralFetchStatus === FETCH_STATUS.failed) {
        scrollAndFocus('h2');
      }
    },
    [referralFetchStatus],
  );

  if (!currentReferral || referralFetchStatus === FETCH_STATUS.loading) {
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
    );
  }

  if (referralFetchStatus === FETCH_STATUS.failed) {
    return (
      <VaAlert status="error" visible>
        <h2 slot="headline">
          There was an error trying to get your referral data
        </h2>
        <p>Please try again later, or contact your VA facility for help.</p>
      </VaAlert>
    );
  }
  const appointmentCountString =
    currentReferral?.numberOfAppointments === 1
      ? '1 appointment'
      : `${currentReferral?.numberOfAppointments} appointments`;
  return (
    <FormLayout pageTitle="Review Approved Referral">
      <div>
        <h1>Referral for {currentReferral?.CategoryOfCare}</h1>
        <p data-testid="subtitle">
          {`Your referring VA facility approved you for ${appointmentCountString} with a community care provider. You can now schedule your appointment with a community care provider.`}
        </p>
        <va-additional-info
          data-testid="help-text"
          uswds
          trigger="If you already scheduled your appointment"
          class="vads-u-margin-bottom--2"
        >
          <p>
            Contact your referring VA facility if you have already scheduled
            with a community care provider.
          </p>
        </va-additional-info>
        <ReferralAppLink linkText="Schedule your appointment" />
        <h2>Details about your referral</h2>
        <p>
          <strong>Expiration date: </strong>
          {`All appointments for this referral must be scheduled by
          ${format(
            new Date(currentReferral?.ReferralExpirationDate),
            'MMMM d, yyyy',
          )}`}
          <br />
          <strong>Type of care: </strong>
          {currentReferral?.CategoryOfCare}
          <br />
          <strong>Provider: </strong>
          {currentReferral?.providerName}
          <br />
          <strong>Location: </strong>
          {currentReferral?.providerLocation}
          <br />
          <strong>Number of appointments: </strong>
          {currentReferral?.numberOfAppointments}
          <br />
          <strong>Referral number: </strong>
          {currentReferral?.ReferralNumber}
        </p>
        <va-additional-info
          data-testid="help-text"
          uswds
          trigger="If you were approved for more than one appointment"
          class="vads-u-margin-bottom--2"
        >
          <p>
            If you were approved for more than one appointment, schedule your
            first appointment using this tool. You’ll need to schedule the
            remaining appointments later with your community care provider.
          </p>
        </va-additional-info>

        <h2>Have questions about your referral?</h2>
        <p>
          Contact your referring VA facility if you have questions about your
          referral or how to schedule your appointment.
        </p>
        <p>
          <strong>Referring VA facility: </strong>
          {currentReferral?.ReferringFacilityInfo.FacilityName}
          <br />
          <strong>Phone: </strong>
          {currentReferral?.ReferringFacilityInfo.Phone}
        </p>
      </div>
    </FormLayout>
  );
}
