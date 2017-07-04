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

    if (this.props.enrollmentData) {
      appContent = this.props.children;
    } else {
      appContent = <LoadingIndicator message="Loading your application..."/>;
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
    enrollmentData: state.post911GIBStatus.enrollmentData
  };
}

const mapDispatchToProps = {
  getEnrollmentData
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
