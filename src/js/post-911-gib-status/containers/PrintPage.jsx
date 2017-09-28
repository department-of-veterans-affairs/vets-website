import React from 'react';
import { connect } from 'react-redux';

import UserInfoSection from '../components/UserInfoSection';

import { formatDateLong } from '../../common/utils/helpers';

class PrintPage extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    const todayFormatted = formatDateLong(new Date());

    return (
      <div className="usa-width-two-thirds medium-8 columns gib-info">
        <div className="print-status">
          <div className="print-screen">
            <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300"/>
            <h1 className="section-header">Post-9/11 GI Bill<sup>&reg;</sup> Statement of Benefits</h1>
            <p>The information in this letter is the Post-9/11 GI Bill Statement of Benefits for the beneficiary listed below as of {todayFormatted}. Any pending or recent changes to enrollment may affect remaining entitlement.</p>
            <UserInfoSection enrollmentData={enrollmentData}/>
          </div>
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

export default connect(mapStateToProps)(PrintPage);
