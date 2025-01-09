import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from '../components/SaveInProgressIntro';

import SubwayMap from '../components/SubwayMap';

const LoggedInContent = ({ route }) => (
  <>
    <SaveInProgressIntro
      formId={route.formConfig.formId}
      prefillEnabled={route.formConfig.prefillEnabled}
      messages={route.formConfig.savedFormMessages}
      formConfig={route.formConfig}
      pageList={route.pageList}
      downtime={route.formConfig.downtime}
      startText="Request a Certificate of Eligibility"
      headingLevel={2}
    />
    <h2 className="vads-u-font-size--h3 vads-u-margin-top--5">
      Follow these steps to request a VA home loan COE
    </h2>
    <SubwayMap />
    <div className="vads-u-margin-bottom--5">
      <SaveInProgressIntro
        buttonOnly
        formId={route.formConfig.formId}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        formConfig={route.formConfig}
        pageList={route.pageList}
        downtime={route.formConfig.downtime}
        startText="Request a Certificate of Eligibility"
        headingLevel={2}
      />
    </div>
    <va-omb-info exp-date="11/30/2022" omb-number="2900-0086" res-burden={15} />
  </>
);

LoggedInContent.propTypes = {
  route: PropTypes.object,
};

export default LoggedInContent;
