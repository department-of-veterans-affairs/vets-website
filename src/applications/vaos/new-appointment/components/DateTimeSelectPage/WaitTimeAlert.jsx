import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isSameDay, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import InfoAlert from '../../../components/InfoAlert';
import NewTabAnchor from '../../../components/NewTabAnchor';
import { getRealFacilityId } from '../../../utils/appointment';
import getNewAppointmentFlow from '../../newAppointmentFlow';
import { startRequestAppointmentFlow } from '../../redux/actions';

function handleClick(history, dispatch, requestDateTime) {
  return () => {
    dispatch(startRequestAppointmentFlow());
    history.push(requestDateTime.url);
  };
}

function UrgentCareMessage() {
  return (
    <>
      <p className="vads-u-font-weight--bold">
        If you have an urgent medical need or need care right away:
      </p>
      <ul>
        <li>
          Call <VaTelephone contact="911" />,{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>
          Call the Veterans Crisis hotline at{' '}
          <VaTelephone contact="988" data-testid="crisis-hotline-telephone" />{' '}
          <span className="vads-u-font-weight--bold">or</span>
        </li>
        <li>Go to your nearest emergency room or VA medical center</li>
      </ul>
    </>
  );
}

function ActionButtons(props) {
  const { eligibleForRequests, facilityId } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { requestDateTime } = useSelector(getNewAppointmentFlow);

  return (
    <div className="vads-u-margin-top--2 vads-u-align-items--center vads-l-row">
      {eligibleForRequests && (
        <>
          <div className="vads-u-text-align--center vads-l-col--12 medium-screen:vads-l-col--5">
            <va-button
              onClick={handleClick(history, dispatch, requestDateTime)}
              text="Request an earlier appointment"
              secondary
              uswds
              data-testid="earlier-request-btn"
            />
          </div>
          <div className="vads-u-padding-y--1 vads-u-font-weight--bold vads-u-text-align--center vads-l-col--12 medium-screen:vads-l-col--2">
            OR
          </div>
        </>
      )}
      <>
        <div className="vads-l-col--12 medium-screen:vads-l-col--5 desktop:vads-u-padding-x--1">
          <NewTabAnchor
            href={`/find-locations/facility/vha_${getRealFacilityId(
              facilityId,
            )}`}
          >
            Contact your local VA medical center
          </NewTabAnchor>
        </div>
      </>
    </div>
  );
}

const WaitTimeAlert = ({
  eligibleForRequests,
  facilityId,
  nextAvailableDate,
  preferredDate,
  timezone,
}) => {
  const today = new Date();
  const showUrgentCareMessage = isSameDay(today, preferredDate);
  if (
    isValid(preferredDate) &&
    isValid(nextAvailableDate) &&
    showUrgentCareMessage
  ) {
    return (
      <InfoAlert
        headline="Your appointment time"
        status={showUrgentCareMessage ? 'warning' : 'info'}
        level={2}
      >
        <>
          <p>
            The earliest we can schedule your appointment is{' '}
            {formatInTimeZone(nextAvailableDate, timezone, 'MMMM d, yyyy')} at{' '}
            {formatInTimeZone(nextAvailableDate, timezone, 'h:mm aaaa')}
          </p>
          <p>If this date doesn’t work, you can:</p>
          <ul>
            {eligibleForRequests && (
              <li>
                Submit a request for an earlier date,{' '}
                <span className="vads-u-font-weight--bold">or</span>
              </li>
            )}
            <li>
              Pick a date from the calendar below,{' '}
              <span className="vads-u-font-weight--bold">or</span>
            </li>
            <li>Call your local VA medical center</li>
          </ul>
          <UrgentCareMessage />
          <ActionButtons
            eligibleForRequests={eligibleForRequests}
            facilityId={facilityId}
          />
        </>
      </InfoAlert>
    );
  }

  if (!isValid(nextAvailableDate)) {
    return (
      <InfoAlert
        headline="We couldn’t find an appointment for your selected date"
        status={showUrgentCareMessage ? 'warning' : 'info'}
        level={2}
      >
        <>
          <p>To schedule this appointment, you can:</p>
          <ul>
            <li>
              Call your local VA medical center,{' '}
              <span className="vads-u-font-weight--bold">or</span>
            </li>
            <li>Submit a request for another date</li>
          </ul>
          <UrgentCareMessage />
          <ActionButtons
            eligibleForRequests={eligibleForRequests}
            facilityId={facilityId}
          />
        </>
      </InfoAlert>
    );
  }

  return null;
};

WaitTimeAlert.propTypes = {
  facilityId: PropTypes.string.isRequired,
  nextAvailableDate: PropTypes.instanceOf(Date).isRequired,
  preferredDate: PropTypes.instanceOf(Date).isRequired,
  timezone: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
  typeOfCareId: PropTypes.string,
};

ActionButtons.propTypes = {
  facilityId: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
};

export default WaitTimeAlert;
