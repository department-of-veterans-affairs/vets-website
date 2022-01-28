import React from 'react';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import SubwayMap from './SubwayMap';

const AuthenticatedContent = props => (
  <>
    <SubwayMap />
    <div className="vads-u-margin-bottom--4">
      <SaveInProgressIntro
        buttonOnly
        testActionLink
        prefillEnabled={props.parentProps.route.formConfig.prefillEnabled}
        messages={props.parentProps.route.formConfig.savedFormMessages}
        formConfig={props.parentProps.route.formConfig}
        pageList={props.parentProps.route.pageList}
        downtime={props.parentProps.route.formConfig.downtime}
        startText="Request a Certificate of Eligibility"
        headingLevel={2}
      />
    </div>
    <OMBInfo expDate="11/30/2022" ombNumber="2900-0086" resBurden={15} />
  </>
);

export default AuthenticatedContent;
