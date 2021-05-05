import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { selectUseProviderSelection } from '../../../redux/selectors';
import {
  getFormData,
  getFlowType,
  getChosenFacilityInfo,
  getChosenClinicInfo,
  getChosenVACityState,
  getChosenFacilityDetails,
  getSiteIdForChosenFacility,
} from '../../redux/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../../../utils/constants';
import { getRealFacilityId } from '../../../utils/appointment';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from './ReviewDirectScheduleInfo';
import ReviewRequestInfo from './ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import * as actions from '../../redux/actions';
import FacilityAddress from '../../../components/FacilityAddress';
import NewTabAnchor from '../../../components/NewTabAnchor';

const pageTitle = 'Review your appointment details';

export function ReviewPage({
  data,
  facility,
  facilityDetails,
  clinic,
  vaCityState,
  flowType,
  submitStatus,
  submitStatusVaos400,
  systemId,
  submitAppointmentOrRequest,
  useProviderSelection,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  if (!data?.typeOfCareId) {
    return <Redirect to="/new-appointment" />;
  }

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
          useProviderSelection={useProviderSelection}
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
          onClick={() => submitAppointmentOrRequest(history)}
          className="usa-button usa-button-primary"
        >
          {isDirectSchedule ? 'Confirm appointment' : 'Request appointment'}
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
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  {isDirectSchedule ? 'appointment' : 'request'}. You’ll need to
                  call your local VA medical center to schedule this
                  appointment.
                </p>
              ) : (
                <p>
                  We’re sorry. Something went wrong when we tried to submit your{' '}
                  {isDirectSchedule ? 'appointment' : 'request'} and you’ll need
                  to start over. We suggest you wait a day to try again or you
                  can call your medical center to help with your{' '}
                  {isDirectSchedule ? 'appointment' : 'request'}.
                </p>
              )}
              <p>
                {!facilityDetails && (
                  <NewTabAnchor
                    href={`/find-locations/facility/vha_${getRealFacilityId(
                      data.vaFacility || data.communityCareSystemId,
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
    useProviderSelection: selectUseProviderSelection(state),
  };
}

const mapDispatchToProps = {
  submitAppointmentOrRequest: actions.submitAppointmentOrRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
