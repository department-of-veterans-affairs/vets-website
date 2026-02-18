import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { GA_PREFIX } from 'applications/vaos/utils/constants';
import ReferralLayout from './components/ReferralLayout';
import { routeToNextReferralPage } from './flow';
import { setFormCurrentPage, setInitReferralFlow } from './redux/actions';
import { selectCurrentPage } from './redux/selectors';
import { getReferralSlotKey } from './utils/referrals';
import { titleCase } from '../utils/formatters';
import FindCommunityCareOfficeLink from './components/FindCCFacilityLink';
import { getIsInPilotReferralStation } from './utils/pilot';

export default function ScheduleReferral(props) {
  const { attributes: currentReferral } = props.currentReferral;
  const location = useLocation();
  const history = useHistory();
  const currentPage = useSelector(selectCurrentPage);
  const dispatch = useDispatch();
  const selectedSlotKey = getReferralSlotKey(currentReferral.uuid);

  const stationIdValid = getIsInPilotReferralStation(currentReferral);
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleReferral'));
      dispatch(setInitReferralFlow());
      sessionStorage.removeItem(selectedSlotKey);
    },
    [location, dispatch, selectedSlotKey],
  );
  const categoryOfCare = titleCase(currentReferral.categoryOfCare);

  const handleClick = () => {
    return e => {
      e.preventDefault();
      recordEvent({
        event: `${GA_PREFIX}-review-upcoming-link`,
      });
      routeToNextReferralPage(history, currentPage, currentReferral.uuid);
    };
  };

  const canScheduleAppointment =
    currentReferral.provider?.npi &&
    !currentReferral.hasAppointments &&
    stationIdValid;

  return (
    <ReferralLayout hasEyebrow heading={`Referral for ${categoryOfCare}`}>
      <div>
        {!canScheduleAppointment && (
          <va-alert
            status="warning"
            data-testid="referral-alert"
            class="vads-u-margin-bottom--2"
          >
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
              Online scheduling isn’t available for this referral right now.
              Call your community care provider or your facility’s community
              care office to schedule an appointment.
            </p>
            <FindCommunityCareOfficeLink />
          </va-alert>
        )}

        <p data-testid="subtitle">
          We’ve approved your referral for community care. You can schedule your
          first appointment now.
        </p>
        <va-additional-info
          data-testid="help-text"
          uswds
          trigger="If you already scheduled your appointment"
          class="vads-u-margin-bottom--2"
        >
          <p>
            Upcoming appointments with community care providers may not appear
            in this tool. If you want us to add your community care appointment
            to your appointments list, call your VA facility.
          </p>
          <va-link
            href="/find-locations/?facilityType=health"
            text="Find your VA health facility"
          />
        </va-additional-info>
        {canScheduleAppointment && (
          <va-link-action
            className="vads-u-margin-top--1"
            href={`/my-health/appointments/schedule-referral?id=${
              currentReferral.uuid
            }`}
            text="Schedule your appointment"
            onClick={handleClick()}
            data-testid="schedule-appointment-button"
          />
        )}
        <h2>Details about your referral</h2>
        <p data-testid="referral-details">
          <strong>Expiration date: </strong>
          {`All appointments for this referral must be scheduled by
          ${format(new Date(currentReferral.expirationDate), 'MMMM d, yyyy')}`}
          <br />
          <strong>Type of care: </strong>
          <span data-dd-privacy="mask">{categoryOfCare}</span>
          <br />
          <strong>Provider: </strong>
          <span data-dd-privacy="mask">
            {currentReferral.provider?.name || 'Not available'}
          </span>
          <br />
          <strong>Location: </strong>
          <span data-dd-privacy="mask">
            {currentReferral.provider?.facilityName || 'Not available'}
          </span>
          <br />
          <strong>Referral number: </strong>
          <span data-dd-privacy="mask">{currentReferral.referralNumber}</span>
        </p>
        <p data-testid="referral-informational-text">
          You can schedule your first appointment online. Contact your community
          care provider directly to schedule the remaining appointments for this
          referral.
        </p>
        <h2>If you have questions about your referral</h2>
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          If you have questions about scheduling an appointment, or about how
          many appointments you have left, contact your facility’s community
          care office.
        </p>
        <FindCommunityCareOfficeLink />
      </div>
    </ReferralLayout>
  );
}

ScheduleReferral.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};
