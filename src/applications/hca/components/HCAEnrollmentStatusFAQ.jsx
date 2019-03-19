import React from 'react';

import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCASubwayMap from '../components/HCASubwayMap';

import {
  getFAQBlock1,
  getFAQBlock2,
  getFAQBlock3,
  getFAQBlock4,
} from '../enrollment-status-helpers';

const ReapplyContent = ({ route }) => (
  <>
    <HCASubwayMap />
    <SaveInProgressIntro
      buttonOnly
      messages={route.formConfig.savedFormMessages}
      pageList={route.pageList}
      startText="Start the Health Care Application"
      downtime={route.formConfig.downtime}
    />
    <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
      <OMBInfo resBurden={30} ombNumber="2900-0091" expDate="05/31/2018" />
    </div>
  </>
);

const ReapplyTextLink = ({ onClick }) => (
  <button className="va-button-link schemaform-start-button" onClick={onClick}>
    Reapply for VA health care
  </button>
);

class HCAEnrollmentStatusFAQ extends React.Component {
  state = {
    showReapplyForHealthCareContent: false,
  };

  showReapplyForHealthCareContent() {
    this.setState({ showReapplyForHealthCareContent: true });
  }

  render() {
    const { enrollmentStatus, route } = this.props;
    return (
      <>
        {getFAQBlock1(enrollmentStatus)}
        {getFAQBlock2(enrollmentStatus)}
        {getFAQBlock3(enrollmentStatus)}
        {getFAQBlock4(enrollmentStatus)}
        {this.state.showReapplyForHealthCareContent && (
          <ReapplyContent route={route} />
        )}
        {!this.state.showReapplyForHealthCareContent && (
          <ReapplyTextLink
            onClick={() => {
              this.showReapplyForHealthCareContent();
            }}
          />
        )}
      </>
    );
  }
}

export default HCAEnrollmentStatusFAQ;
