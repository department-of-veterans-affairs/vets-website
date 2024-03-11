import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { shouldShowReapplyContent } from '../../../../utils/selectors';
import ProcessTimeline from '../../GetStarted/ProcessTimeline';
import OMBInfo from '../../GetStarted/OMBInfo';
import FAQContent from './FAQContent';

const EnrollmentStatusFAQ = props => {
  const showReapplyContent = useSelector(shouldShowReapplyContent);
  const { enrollmentStatus, route } = props;
  const { formConfig, pageList } = route;

  return (
    <>
      {!showReapplyContent ? (
        <FAQContent enrollmentStatus={enrollmentStatus} />
      ) : (
        <>
          <ProcessTimeline />

          <div className="hca-sip-intro vads-u-margin-y--3">
            <SaveInProgressIntro
              messages={formConfig.savedFormMessages}
              downtime={formConfig.downtime}
              pageList={pageList}
              startText="Start the health care application"
              buttonOnly
            />
          </div>

          <OMBInfo />
        </>
      )}
    </>
  );
};

EnrollmentStatusFAQ.propTypes = {
  enrollmentStatus: PropTypes.string,
  renderReapplyContent: PropTypes.func,
  route: PropTypes.object,
};

export default EnrollmentStatusFAQ;
