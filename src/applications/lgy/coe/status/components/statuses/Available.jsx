import React from 'react';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';

import DocumentList from '../DocumentList';
import MoreQuestions from '../MoreQuestions';
import MakeChanges from '../MakeChanges';

const Available = ({ downloadUrl }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <ReviewAndDownload downloadUrl={downloadUrl} />
      <MakeChanges />
      <DocumentList />
      <MoreQuestions />
    </div>
  </div>
);

export default Available;
