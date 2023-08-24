import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import content from '../../locales/en/content.json';
import ProcessTimeline from './ProcessTimeline';
import OMBInfo from './OMBInfo';

const GetStarted = ({ route, enrolled }) => {
  const { formConfig, pageList } = route;
  const { downtime, prefillEnabled, savedFormMessages } = formConfig;
  return !enrolled ? (
    <va-alert status="warning">
      <h2 slot="headline">Not Enrolled Headline</h2>
      <p>Not enrolled content...</p>
    </va-alert>
  ) : (
    <>
      <SaveInProgressIntro
        headingLevel={2}
        prefillEnabled={prefillEnabled}
        messages={savedFormMessages}
        downtime={downtime}
        pageList={pageList}
        startText={content['sip-start-application']}
      />

      <ProcessTimeline />

      <SaveInProgressIntro
        prefillEnabled={prefillEnabled}
        messages={savedFormMessages}
        downtime={downtime}
        pageList={pageList}
        startText={content['sip-start-application']}
        buttonOnly
      />

      <OMBInfo />
    </>
  );
};

GetStarted.propTypes = {
  enrolled: PropTypes.bool,
  route: PropTypes.object,
};

export default GetStarted;
