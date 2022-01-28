import React from 'react';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import StatusBox from '../../../shared/components/StatusBox';
import MakeChanges from '../MakeChanges';
import MoreQuestions from '../MoreQuestions';

const Eligible = ({ clickHandler, downloadUrl }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <StatusBox.Eligible />
      <ReviewAndDownload downloadUrl={downloadUrl} />
      <MakeChanges clickHandler={clickHandler} />
      <MoreQuestions />
    </div>
  </div>
);

export default Eligible;
