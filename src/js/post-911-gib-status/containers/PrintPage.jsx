import React from 'react';
import { connect } from 'react-redux';

import UserInfoSection from '../components/UserInfoSection';
import InfoPair from '../components/InfoPair';

import { formatDateShort, formatDateLong } from '../../common/utils/helpers';

class PrintPage extends React.Component {
  render() {
    const enrollmentData = this.props.enrollmentData || {};

    const todayFormatted = formatDateShort(new Date());

    return (
      <div className="print-status">
        <div className="print-screen">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300"/>
          <h1 className="section-header">Post-9/11 GI Bill Certificate of Eligibility</h1>
          <UserInfoSection enrollmentData={enrollmentData}/>
          <InfoPair label="Benefits expire on" value={formatDateLong(enrollmentData.delimitingDate)}/>
          <p>This information is current as of {todayFormatted}.</p>
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
