import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import FormTitle from '../../common/schemaform/FormTitle';

import { getEnrollmentData } from '../actions/post-911-gib-status';
import EnrollmentHistory from '../components/EnrollmentHistory';
import UserInfoSection from '../components/UserInfoSection';

class StatusPage extends React.Component {
  componentDidMount() {
    this.props.getEnrollmentData();
  }

  render() {
    const { enrollmentData } = this.props;

    return (
      <div>
        <FormTitle title="Post-9/11 GI Bill Entitlement Information"/>
        <div className="va-introtext">
          <p>
            View your Post-9/11 GI Bill enrollment information below. This is the same information
            in your Certificate of Eligibility (COE) letter. In lieu of a COE letter, you can
            print a copy of this screen for benefit and eligibility verification.
          </p>
        </div>
        <div className="section-line">
          <Link to="/print" target="_blank" className="usa-button-primary">
            Print This Page as COE
          </Link>
        </div>
        <UserInfoSection enrollmentData={enrollmentData} showCurrentAsOfAlert/>
        <EnrollmentHistory enrollmentData={enrollmentData}/>
        <div className="feature help-desk">
          <h2>Need help?</h2>
          <div>Call 888-442-4551 (888-GI-BILL-1) from 8:00 a.m. to 7:00 p.m. (ET)</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(StatusPage);
