import React from 'react';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import SubwayMap from '../../components/SubwayMap';

const shouldShowHeader = status => {
  const showStatuses = ['ineligible', 'pending', 'pending-upload'];

  return showStatuses.includes(status);
};

const LoggedInContent = ({ route, status }) => (
  <>
    <SaveInProgressIntro
      testActionLink
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      formConfig={route.formConfig}
      pageList={route.pageList}
      downtime={route.formConfig.downtime}
      startText="Request a Certificate of Eligibility"
      headingLevel={2}
    />
    {shouldShowHeader(status) && (
      <h2 className="vads-u-margin-top--5">
        Follow these steps to request a VA home loan COE
      </h2>
    )}
    <SubwayMap />
    <div className="vads-u-margin-bottom--5">
      <SaveInProgressIntro
        buttonOnly
        testActionLink
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        downtime={route.formConfig.downtime}
        startText="Request a Certificate of Eligibility"
        headingLevel={2}
      />
    </div>
    <OMBInfo expDate="11/30/2022" ombNumber="2900-0086" resBurden={15} />
  </>
);

LoggedInContent.propTypes = {
  route: PropTypes.object,
  status: PropTypes.string,
};

export default LoggedInContent;
