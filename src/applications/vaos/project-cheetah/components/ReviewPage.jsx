import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
// import * as actions from '../redux/actions';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FETCH_STATUS } from '../../utils/constants';
import FacilityAddress from '../../components/FacilityAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone';
import { getRealFacilityId } from '../../utils/appointment';
import { getReviewPage } from '../redux/selectors';

const pageTitle = 'Review your appointment details';

function ReviewPage({
  data,
  facility,
  facilityDetails,
  clinic,
  history,
  submitStatus,
  submitStatusVaos400,
  systemId,
}) {
  const { date1, date2, vaFacility } = data;

  useEffect(() => {
    if (history && !vaFacility) {
      history.replace('/new-project-cheetah-booking');
    }
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--3 vads-u-font-size--h3">
        You’re scheduling Project Cheetah appointments
      </h2>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
        Please review the information before confirming your appointments.
      </p>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <ul className="usa-unstyled-list">
        <li>
          {moment(date1, 'YYYY-MM-DDTHH:mm:ssZ').format(
            'dddd, MMMM DD, YYYY [at] h:mm a ',
          ) + getTimezoneAbbrBySystemId(systemId)}
        </li>
        <li>
          {moment(date2, 'YYYY-MM-DDTHH:mm:ssZ').format(
            'dddd, MMMM DD, YYYY [at] h:mm a ',
          ) + getTimezoneAbbrBySystemId(systemId)}
        </li>
      </ul>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <h3 className="vaos-appts__block-label">{clinic.serviceName}</h3>
      {facility.name}
      <br />
      {facility.address?.city}, {facility.address?.state}
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-u-margin-y--2">
        <LoadingButton
          disabled={
            submitStatus === FETCH_STATUS.succeeded ||
            submitStatus === FETCH_STATUS.failed
          }
          isLoading={submitStatus === FETCH_STATUS.loading}
          loadingText="Submission in progress"
          className="usa-button usa-button-primary"
        >
          Confirm appointment
        </LoadingButton>
      </div>
      {submitStatus === FETCH_STATUS.failed && (
        <AlertBox
          status="error"
          headline="We couldn’t schedule this appointment"
          content={
            <>
              {submitStatusVaos400 ? (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your
                  appointment. You’ll need to call your local VA medical center
                  to schedule this appointment.
                </p>
              ) : (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  appointment and you’ll need to start over. We suggest you wait
                  a day to try again or you can call your medical center to help
                  with your appointment.
                </p>
              )}
              <p>
                {!facilityDetails && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      data.vaFacility,
                    )}`}
                  >
                    {submitStatusVaos400
                      ? 'Find facility contact information'
                      : 'Contact your local VA medical center'}
                  </a>
                )}
                {!!facilityDetails && (
                  <FacilityAddress
                    name={facilityDetails.name}
                    facility={facilityDetails}
                    showDirectionsLink
                  />
                )}
              </p>
            </>
          }
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getReviewPage(state);
}

const mapDispatchToProps = {
  // submitAppointmentOrRequest: actions.submitAppointmentOrRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
