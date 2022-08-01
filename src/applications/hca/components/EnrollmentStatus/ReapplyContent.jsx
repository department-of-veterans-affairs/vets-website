import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCASubwayMap from '../HCASubwayMap';
import HcaOMBInfo from '../HcaOMBInfo';

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
      <div className="omb-info--container vads-u-padding-left--0">
        <HcaOMBInfo />
      </div>
    </>
  );
};

ReapplyContent.propTypes = {
  route: PropTypes.object,
};

export default ReapplyContent;
