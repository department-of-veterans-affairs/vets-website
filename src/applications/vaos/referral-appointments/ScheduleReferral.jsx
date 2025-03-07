import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import ReferralLayout from './components/ReferralLayout';
import ReferralAppLink from './components/ReferralAppLink';
import { setFormCurrentPage, setInitReferralFlow } from './redux/actions';
import { getReferralSlotKey } from './utils/referrals';

export default function ScheduleReferral(props) {
  const { currentReferral } = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedSlotKey = getReferralSlotKey(currentReferral.UUID);
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleReferral'));
      dispatch(setInitReferralFlow());
      sessionStorage.removeItem(selectedSlotKey);
    },
    [location, dispatch, selectedSlotKey],
  );
  return (
    <ReferralLayout
      hasEyebrow
      heading={`Referral for ${currentReferral.CategoryOfCare}`}
      categoryOfCare={currentReferral?.CategoryOfCare}
    >
      <div>
        <p data-testid="subtitle">
          We’ve approved your referral with a community care provider. You can
          schedule your first appointment now.
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
        <ReferralAppLink
          linkText="Schedule your appointment"
          id={currentReferral.UUID}
        />
        <h2>Details about your referral</h2>
        <p data-testid="referral-details">
          <strong>Expiration date: </strong>
          {`All appointments for this referral must be scheduled by
          ${format(
            new Date(currentReferral.ReferralExpirationDate),
            'MMMM d, yyyy',
          )}`}
          <br />
          <strong>Type of care: </strong>
          {currentReferral.CategoryOfCare}
          <br />
          <strong>Provider: </strong>
          {currentReferral.providerName}
          <br />
          <strong>Location: </strong>
          {currentReferral.providerLocation}
          <br />
          <strong>Referral number: </strong>
          {currentReferral.ReferralNumber}
        </p>
        <va-additional-info
          data-testid="additional-appointment-help-text"
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
        <p data-testid="referral-facility">
          <strong>Referring VA facility: </strong>
          {currentReferral.ReferringFacilityInfo.FacilityName}
          <br />
          <strong>Phone: </strong>
          {currentReferral.ReferringFacilityInfo.Phone}
        </p>
      </div>
    </ReferralLayout>
  );
}

ScheduleReferral.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};
