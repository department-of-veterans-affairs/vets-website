import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import HCAOMBInfo from '../HCAOMBInfo';
import HCASubwayMap from '../HCASubwayMap';

const ReapplyContent = ({ route }) => {
  const { formConfig, pageList } = route;
  return (
    <>
      <HCASubwayMap />
      <div className="vads-u-margin-y--3">
        <SaveInProgressIntro
          startText="Start the health care application"
          messages={formConfig.savedFormMessages}
          downtime={formConfig.downtime}
          pageList={pageList}
          buttonOnly
        />
      </div>
      <div className="omb-info--container vads-u-padding-left--0">
        <HCAOMBInfo />
      </div>
    </>
  );
};

ReapplyContent.propTypes = {
  route: PropTypes.object,
};

export default ReapplyContent;
