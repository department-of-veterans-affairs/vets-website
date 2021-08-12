import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { Link } from 'react-router-dom';
import { getRealFacilityId } from '../../../utils/appointment';
import newAppointmentFlow from '../../newAppointmentFlow';
import NewTabAnchor from '../../../components/NewTabAnchor';
import InfoAlert from '../../../components/InfoAlert';

export const WaitTimeAlert = ({
  eligibleForRequests,
  facilityId,
  nextAvailableApptDate,
  onClickRequest,
  preferredDate,
  timezone,
}) => {
  const today = moment();
  const momentPreferredDate = moment(preferredDate);
  const momentNextAvailableDate = moment(nextAvailableApptDate);

  if (momentPreferredDate.isValid() && momentNextAvailableDate.isValid()) {
    const showUrgentCareMessage = today.isSame(momentPreferredDate, 'day');

    if (showUrgentCareMessage) {
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
              {momentNextAvailableDate.format('h:mm a')} {timezone}.
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
            <p className="vads-u-font-weight--bold">
              If you have an urgent medical need or need care right away:
            </p>
            <ul>
              <li>
                Call <Telephone contact="911" />,{' '}
                <span className="vads-u-font-weight--bold">or</span>
              </li>
              <li>
                Call the Veterans Crisis hotline at{' '}
                <Telephone contact={CONTACTS.CRISIS_LINE} /> and select 1,{' '}
                <span className="vads-u-font-weight--bold">or</span>
              </li>
              <li>Go to your nearest emergency room or VA medical center</li>
            </ul>
            <div className="vads-u-display--flex vads-u-margin-top--2 vads-u-align-items--center">
              {eligibleForRequests && (
                <>
                  <Link to={newAppointmentFlow.requestDateTime.url}>
                    <button
                      className="usa-button-secondary vads-u-margin-x--0"
                      onClick={onClickRequest}
                    >
                      Request an earlier appointment
                    </button>
                  </Link>
                  <span className="vads-u-display--inline-block vads-u-margin-x--2p5 vads-u-font-weight--bold">
                    OR
                  </span>
                </>
              )}
              <NewTabAnchor
                href={`/find-locations/facility/vha_${getRealFacilityId(
                  facilityId,
                )}`}
              >
                Contact your local VA medical center
              </NewTabAnchor>
            </div>
          </>
        </InfoAlert>
      );
    }
  }

  return null;
};

WaitTimeAlert.propTypes = {
  preferredDate: PropTypes.string.isRequired,
  nextAvailableApptDate: PropTypes.string,
  typeOfCareId: PropTypes.string,
  eligibleForRequests: PropTypes.bool,
  onClickRequest: PropTypes.func,
};

export default WaitTimeAlert;
