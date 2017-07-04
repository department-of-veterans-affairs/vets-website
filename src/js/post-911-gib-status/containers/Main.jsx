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

    if (this.props.available) {
      appContent = this.props.children;
    } else if (this.props.available === undefined) {
      appContent = <LoadingIndicator message="Loading your application..."/>;
    } else {
      appContent = <div>Warning message: need content for when fetch of data from vets-api fails</div>;
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
    available: state.post911GIBStatus.available
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
