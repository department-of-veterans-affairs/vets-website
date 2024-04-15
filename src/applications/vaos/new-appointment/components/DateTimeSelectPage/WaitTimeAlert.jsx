import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { startRequestAppointmentFlow } from '../../redux/actions';
import { getRealFacilityId } from '../../../utils/appointment';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';
import { getTimezoneByFacilityId } from '../../../utils/timezone';
import getNewAppointmentFlow from '../../newAppointmentFlow';

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
    <div className="vads-u-display--flex vads-u-margin-top--2 vads-u-align-items--center">
      {eligibleForRequests && (
        <>
          <va-button
            onClick={handleClick(history, dispatch, requestDateTime)}
            text="Request an earlier appointment"
            secondary
            uswds
          />
          <span className="vads-u-display--inline-block vads-u-margin-x--2p5 vads-u-font-weight--bold">
            OR
          </span>
        </>
      )}
      <NewTabAnchor
        href={`/find-locations/facility/vha_${getRealFacilityId(facilityId)}`}
      >
        Contact your local VA medical center
      </NewTabAnchor>
    </div>
  );
}

export const WaitTimeAlert = ({
  eligibleForRequests,
  facilityId,
  nextAvailableApptDate,
  preferredDate,
}) => {
  const today = moment();
  const momentPreferredDate = moment(preferredDate);
  let momentNextAvailableDate;
  if (nextAvailableApptDate?.includes('Z')) {
    momentNextAvailableDate = moment(nextAvailableApptDate).tz(
      getTimezoneByFacilityId(facilityId),
    );
  } else {
    momentNextAvailableDate = moment.parseZone(nextAvailableApptDate);
  }

  if (momentPreferredDate.isValid() && momentNextAvailableDate.isValid()) {
    const showUrgentCareMessage = today.isSame(momentPreferredDate, 'day');
    const hasNextAvailableApptDate = !!nextAvailableApptDate;

    if (showUrgentCareMessage && hasNextAvailableApptDate) {
      return (
        <InfoAlert
          headline="Your appointment time"
          status={showUrgentCareMessage ? 'warning' : 'info'}
          level={2}
        >
          <>
            <p>
              The earliest we can schedule your appointment is{' '}
              {momentNextAvailableDate.format('MMMM D, YYYY')} at{' '}
              {momentNextAvailableDate.format('h:mm a')}
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
    if (!hasNextAvailableApptDate) {
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
  }

  return null;
};

WaitTimeAlert.propTypes = {
  facilityId: PropTypes.string.isRequired,
  preferredDate: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
  nextAvailableApptDate: PropTypes.string,
  typeOfCareId: PropTypes.string,
};

ActionButtons.propTypes = {
  facilityId: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
};

export default WaitTimeAlert;
