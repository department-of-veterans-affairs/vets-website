import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getFlowType,
  getChosenFacilityInfo,
  getChosenClinicInfo,
  getChosenVACityState,
} from '../utils/selectors';
import { FLOW_TYPES } from '../utils/constants';
import ReviewDirectScheduleInfo from '../components/ReviewDirectScheduleInfo';
import ReviewRequestInfo from '../components/ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { submitAppointmentOrRequest } from '../actions/newAppointment';

export class ReviewPage extends React.Component {
  render() {
    const {
      data,
      facility,
      clinic,
      vaCityState,
      flowType,
      router,
    } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ReviewDirectScheduleInfo
            data={data}
            facility={facility}
            clinic={clinic}
          />
        )}
        {!isDirectSchedule && (
          <ReviewRequestInfo
            data={data}
            facility={facility}
            vaCityState={vaCityState}
          />
        )}
        <div className="vads-u-margin-y--2">
          <LoadingButton
            onClick={() => this.props.submitAppointmentOrRequest(router)}
            className="usa-button usa-button-primary"
          >
            {isDirectSchedule ? 'Confirm appointment' : 'Request appointment'}
          </LoadingButton>
        </div>
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
    clinic: getChosenClinicInfo(state),
    vaCityState: getChosenVACityState(state),
    flowType: getFlowType(state),
  };
}

const mapDispatchToProps = {
  submitAppointmentOrRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
