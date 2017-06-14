import React from 'react';
import { connect } from 'react-redux';

import FormTitle from '../../common/schemaform/FormTitle';

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
        <FormTitle title="Post-9/11 GI Bill Status"/>
        <div className="va-introtext">
          <p>
            View your Post-9/11 GI Bill enrollment information below. This is the same information
            in your Certificate of Eligibility (COE) letter. In lieu of a COE letter, you can
            print a copy of this screen for benefit and eligibility verification.
          </p>
        </div>
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
