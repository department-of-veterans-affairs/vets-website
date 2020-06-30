import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import {
  getFormData,
  getFlowType,
  getChosenFacilityInfo,
  getChosenClinicInfo,
  getChosenVACityState,
  getChosenFacilityDetails,
  getSiteIdForChosenFacility,
} from '../utils/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../utils/constants';
import { getRealFacilityId } from '../utils/appointment';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from '../components/review/ReviewDirectScheduleInfo';
import ReviewRequestInfo from '../components/review/ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { submitAppointmentOrRequest } from '../actions/newAppointment';
import FacilityAddress from '../components/FacilityAddress';

const pageTitle = 'Review your appointment details';

export class ReviewPage extends React.Component {
  componentDidMount() {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    const { data, router } = this.props;
    // Check formData for typeOfCareId. Reroute if empty
    if (router && !data?.typeOfCareId) {
      router.replace('/new-appointment');
    }
  }

  render() {
    const {
      data,
      facility,
      facilityDetails,
      clinic,
      vaCityState,
      flowType,
      router,
      submitStatus,
      submitStatusVaos400,
      systemId,
    } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ReviewDirectScheduleInfo
            data={data}
            facility={facility}
            systemId={systemId}
            clinic={clinic}
            pageTitle={pageTitle}
          />
        )}
        {!isDirectSchedule && (
          <ReviewRequestInfo
            data={data}
            facility={facility}
            vaCityState={vaCityState}
            pageTitle={pageTitle}
          />
        )}
        <div className="vads-u-margin-y--2">
          <LoadingButton
            disabled={
              submitStatus === FETCH_STATUS.succeeded ||
              submitStatus === FETCH_STATUS.failed
            }
            isLoading={submitStatus === FETCH_STATUS.loading}
            loadingText="Submission in progress"
            onClick={() => this.props.submitAppointmentOrRequest(router)}
            className="usa-button usa-button-primary"
          >
            {isDirectSchedule ? 'Confirm appointment' : 'Request appointment'}
          </LoadingButton>
        </div>
        {submitStatus === FETCH_STATUS.failed && (
          <AlertBox
            status="error"
            headline={
              submitStatusVaos400
                ? 'We can’t schedule your appointment'
                : `Your ${
                    isDirectSchedule ? 'appointment' : 'request'
                  } didn’t go through`
            }
            content={
              <>
                {submitStatusVaos400 ? (
                  <p>
                    We’re sorry. You can’t schedule your appointment on the VA
                    appointments tool. Please contact your local VA medical
                    center to schedule this appointment:
                  </p>
                ) : (
                  <p>
                    Something went wrong when we tried to submit your{' '}
                    {isDirectSchedule ? 'appointment' : 'request'} and you’ll
                    need to start over. We suggest you wait a day to try again
                    or you can call your medical center to help with your{' '}
                    {isDirectSchedule ? 'appointment' : 'request'}.
                  </p>
                )}
                <p>
                  {!facilityDetails && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/find-locations/facility/vha_${getRealFacilityId(
                        data.vaFacility || data.communityCareSystemId,
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
}

ReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  clinic: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    facilityDetails: getChosenFacilityDetails(state),
    clinic: getChosenClinicInfo(state),
    vaCityState: getChosenVACityState(state),
    flowType: getFlowType(state),
    submitStatus: state.newAppointment.submitStatus,
    submitStatusVaos400: state.newAppointment.submitStatusVaos400,
    systemId: getSiteIdForChosenFacility(state),
  };
}

const mapDispatchToProps = {
  submitAppointmentOrRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
