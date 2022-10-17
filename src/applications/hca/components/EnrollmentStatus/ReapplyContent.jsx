import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCAPrivacyActStatement from '../HCAPrivacyActStatement';
import HCASubwayMap from '../HCASubwayMap';

const ReapplyContent = ({ route }) => {
  const { formConfig, pageList } = route;
  return (
    <>
      <HCASubwayMap />

      <div className="vads-u-margin-y--3">
        <SaveInProgressIntro
          messages={formConfig.savedFormMessages}
          downtime={formConfig.downtime}
          pageList={pageList}
          startText="Start the health care application"
          buttonOnly
        />
      </div>

      <va-omb-info exp-date="06/30/2024" omb-number="2900-0091" res-burden={30}>
        <HCAPrivacyActStatement />
      </va-omb-info>
    </>
  );
};

ReapplyContent.propTypes = {
  route: PropTypes.object,
};

export default ReapplyContent;
