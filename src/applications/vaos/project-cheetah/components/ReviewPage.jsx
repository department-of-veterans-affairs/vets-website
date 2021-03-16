import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Link, useHistory, Redirect } from 'react-router-dom';
import * as actions from '../redux/actions';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { FETCH_STATUS } from '../../utils/constants';
import FacilityAddress from '../../components/FacilityAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getTimezoneAbbrBySystemId } from '../../utils/timezone';
import { getRealFacilityId } from '../../utils/appointment';
import { getReviewPage } from '../redux/selectors';
import flow from '../flow';
import State from '../../components/State';
import NewTabAnchor from '../../components/NewTabAnchor';

const pageTitle = 'Review your appointment details';

function ReviewPage({
  data,
  facility,
  facilityDetails,
  clinic,
  confirmAppointment,
  submitStatus,
  submitStatusVaos400,
  systemId,
}) {
  const history = useHistory();
  const { date1, vaFacility } = data;

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  if (!vaFacility) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
        Please review the information before confirming your appointment.
      </p>
      <h2 className="vads-u-margin-bottom--0 vads-u-margin-top--3 vads-u-font-size--h3">
        COVID-19 vaccine
      </h2>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <strong>
              {moment(date1, 'YYYY-MM-DDTHH:mm:ssZ').format(
                'dddd, MMMM DD, YYYY [at] h:mm a ',
              ) + getTimezoneAbbrBySystemId(systemId)}
            </strong>
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">{facility.name}</h3>
            {clinic.serviceName}
            <br />
            {facility.address?.line?.map(line => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
            {facility.address?.city}, <State state={facility.address?.state} />
          </div>
        </div>
      </div>
      <hr aria-hidden="true" className="vads-u-margin-y--2" />
      <div className="vads-l-grid-container vads-u-padding--0">
        <div className="vads-l-row vads-u-justify-content--space-between">
          <div className="vads-u-flex--1 vads-u-padding-right--1">
            <h3 className="vaos-appts__block-label">Your contact details</h3>
            <div>
              {data.email}
              <br />
              {data.phoneNumber}
            </div>
          </div>
          <Link to={flow.contactInfo.url} aria-label="Edit contact information">
            Edit
          </Link>
        </div>
      </div>
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
          onClick={() => confirmAppointment(history)}
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
                  <NewTabAnchor
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      data.vaFacility,
                    )}`}
                  >
                    {submitStatusVaos400
                      ? 'Find facility contact information'
                      : 'Contact your local VA medical center'}
                  </NewTabAnchor>
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
  confirmAppointment: actions.confirmAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
