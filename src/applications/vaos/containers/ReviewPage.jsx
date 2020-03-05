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
} from '../utils/selectors';
import { FLOW_TYPES, FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import ReviewDirectScheduleInfo from '../components/review/ReviewDirectScheduleInfo';
import ReviewRequestInfo from '../components/review/ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { submitAppointmentOrRequest } from '../actions/newAppointment';

const pageTitle = 'Review your appointment details';

export class ReviewPage extends React.Component {
  componentDidMount() {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  render() {
    const {
      data,
      facility,
      clinic,
      vaCityState,
      flowType,
      router,
      submitStatus,
    } = this.props;
    const isDirectSchedule = flowType === FLOW_TYPES.DIRECT;

    return (
      <div>
        {isDirectSchedule && (
          <ReviewDirectScheduleInfo
            data={data}
            facility={facility}
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
            disabled={submitStatus === FETCH_STATUS.succeeded}
            isLoading={submitStatus === FETCH_STATUS.loading}
            onClick={() => this.props.submitAppointmentOrRequest(router)}
            className="usa-button usa-button-primary"
          >
            {isDirectSchedule ? 'Confirm appointment' : 'Request appointment'}
          </LoadingButton>
        </div>
        {submitStatus === FETCH_STATUS.failed && (
          <AlertBox status="error" headline="We're sorry. Something went wrong">
            We ran into a problem trying to submit your request. Please try
            again later.
          </AlertBox>
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
    clinic: getChosenClinicInfo(state),
    vaCityState: getChosenVACityState(state),
    flowType: getFlowType(state),
    submitStatus: state.newAppointment.submitStatus,
  };
}

const mapDispatchToProps = {
  submitAppointmentOrRequest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReviewPage);
