import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getChosenFacilityInfo,
  getChosenClinicInfo,
  getChosenVACityState,
} from '../utils/selectors';
import ReviewDirectScheduleInfo from '../components/ReviewDirectScheduleInfo';
import ReviewRequestInfo from '../components/ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

export class ReviewPage extends React.Component {
  render() {
    const { data, facility, clinic, vaCityState } = this.props;

    return (
      <div>
        {data.isDirectSchedule && (
          <ReviewDirectScheduleInfo
            data={data}
            facility={facility}
            clinic={clinic}
          />
        )}
        {!data.isDirectSchedule && (
          <ReviewRequestInfo
            data={data}
            facility={facility}
            vaCityState={vaCityState}
          />
        )}
        <div className="vads-u-margin-y--2">
          <LoadingButton
            onClick={() => this.props.router.push('/')}
            className="usa-button usa-button-primary"
          >
            {data.isDirectSchedule
              ? 'Confirm appointment'
              : 'Request appointment'}
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
  };
}

export default connect(mapStateToProps)(ReviewPage);
