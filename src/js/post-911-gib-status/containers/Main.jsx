import React from 'react';
import { connect } from 'react-redux';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import EnrollmentHistory from '../components/EnrollmentHistory';
import UserInfoSection from '../components/UserInfoSection';

class Main extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    // TODO: change the service name below from "user-profile" to
    // something like "post-911-gib-status" once its defined in vets-api
    const { enrollmentData } = this.props;

    return (
      <div>
        <UserInfoSection enrollmentData={enrollmentData}/>
        <EnrollmentHistory enrollmentData={enrollmentData}/>
        <div className="feature help-desk">
          <h2>Need help?</h2>
          <div>Call the Vets.gov Help Desk</div>
          <div>1-855-574-7286</div>
          <div>Monday - Friday, 8:00am - 8:00pm (ET)</div>
        </div>
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
