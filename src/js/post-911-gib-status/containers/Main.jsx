import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import { getEnrollmentData } from '../actions/post-911-gib-status';

class Main extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    let appContent;

    if (this.props.availability === 'available') {
      appContent = this.props.children;
    } else if (this.props.availability === 'awaitingResponse') {
      appContent = <LoadingIndicator message="Loading your Post-9/11 GI Bill benefit information..."/>;
    } else if (this.props.availability === 'unavailable') {
      appContent = (
        <div>
          <div className="usa-alert usa-alert-error" role="alert">
            <div className="usa-alert-body">
              <h4 className="usa-alert-heading">Post-9/11 GI Bill Benefit Information Unavailable</h4>
              <p className="usa-alert-text">
                We weren't able to retrieve your Post-9/11 GI Bill benefit information. Please call
                888-442-4551 (888-GI-BILL-1) from 8 a.m. to 7 p.m. (ET).
              </p>
            </div>
          </div>
          <br/>
        </div>
      );
    }

    return (
      <div className="gib-info">
        {appContent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    enrollmentData: state.post911GIBStatus.enrollmentData,
    availability: state.post911GIBStatus.availability
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
