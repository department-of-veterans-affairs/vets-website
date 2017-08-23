import React from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router';

import FormTitle from '../../common/schemaform/FormTitle';

import EnrollmentHistory from '../components/EnrollmentHistory';
import UserInfoSection from '../components/UserInfoSection';

class StatusPage extends React.Component {
  render() {
    const { enrollmentData } = this.props;
    let introText;
    let printButton;
    if (enrollmentData.veteranIsEligible) {
      window.dataLayer.push({ event: 'post911-status-info-shown' });
      introText = (
        <div className="va-introtext">
          <p>
            The information on this page is the same information that’s in your
            Certificate of Eligibility (COE) letter for Post-9/11 GI Bill
            (Chapter 33) benefits. You can print this page and use it instead
            of your COE to show that you qualify for benefits.
          </p>
        </div>
      );

      printButton = (
        <div className="section">
          <Link to="/print" target="_blank" className="usa-button-primary" id="print-button">
            Print Statement of Benefits
          </Link>
        </div>
      );
    }

    return (
      <div className="usa-width-two-thirds medium-8 columns gib-info">
        <FormTitle title="Post-9/11 GI Bill Statement of Benefits"/>
        {introText}
        {printButton}
        <UserInfoSection enrollmentData={enrollmentData}/>
        <EnrollmentHistory enrollmentData={enrollmentData}/>
        <div className="feature help-desk">
          <h2>Need help?</h2>
          <div>Call 888-442-4551 (888-GI-BILL-1) from 8 a.m. to 7 p.m. (ET)</div>
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

export default connect(mapStateToProps)(StatusPage);
