import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { Link } from 'react-router-dom';
import { MENTAL_HEALTH } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import newAppointmentFlow from '../../newAppointmentFlow';

export const WaitTimeAlert = ({
  eligibleForRequests,
  facilityId,
  nextAvailableApptDate,
  onClickRequest,
  preferredDate,
  timezone,
  typeOfCareId,
}) => {
  const today = moment();
  const momentPreferredDate = moment(preferredDate);
  const momentNextAvailableDate = moment(nextAvailableApptDate);

  if (momentPreferredDate.isValid() && momentNextAvailableDate.isValid()) {
    const showUrgentCareMessage = today.isSame(momentPreferredDate, 'day');

    // If Preferred date >5 days away, and next avail appointment is >20 (mental health)
    // or 28 (other ToCs) days away from the preferred date, show request alert
    const nextAvailableDateWarningLimit =
      typeOfCareId === MENTAL_HEALTH ? 20 : 28;

    const daysBetweenNowAndNextAvailable = moment
      .duration(momentNextAvailableDate.diff(today))
      .asDays();

    const notMeetingStandardOfCare =
      momentPreferredDate.isAfter(moment().add(5, 'days'), 'day') &&
      daysBetweenNowAndNextAvailable > nextAvailableDateWarningLimit;

    if (showUrgentCareMessage || notMeetingStandardOfCare) {
      return (
        <AlertBox
          headline="Your earliest appointment time"
          status={showUrgentCareMessage ? 'warning' : 'info'}
          content={
            <>
              <p>
                The earliest we can schedule your appointment is{' '}
                {momentNextAvailableDate.format('MMMM D, YYYY')} at{' '}
                {momentNextAvailableDate.format('h:mm a')} {timezone}.
              </p>
              <p>If this date doesn't work, you can:</p>
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
              {showUrgentCareMessage && (
                <>
                  <p>If you have an urgent medical need, please:</p>
                  <ul>
                    <li>
                      Call the Veterans Crisis hotline at{' '}
                      <a href="tel:8002738255">800-273-8255</a> and press 1,{' '}
                      <span className="vads-u-font-weight--bold">or</span>
                    </li>
                    <li>
                      Go to your nearest emergency room or VA medical center.{' '}
                      <a href="/find-locations/">
                        Find your nearest VA medical center
                      </a>
                    </li>
                  </ul>
                </>
              )}
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
                <a
                  href={`/find-locations/facility/vha_${getRealFacilityId(
                    facilityId,
                  )}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Contact your local VA medical center
                </a>
              </div>
            </>
          }
        />
      );
    }
  }

  return null;
};

WaitTimeAlert.propTypes = {
  preferredDate: PropTypes.string.isRequired,
  nextAvailableApptDate: PropTypes.string,
  typeOfCareId: PropTypes.string.isRequired,
  eligibleForRequests: PropTypes.bool,
  onClickRequest: PropTypes.func,
};

export default WaitTimeAlert;
