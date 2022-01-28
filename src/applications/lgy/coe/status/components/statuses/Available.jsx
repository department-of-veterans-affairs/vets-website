import React from 'react';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';

import { CoeDocumentList } from '../CoeDocumentList';
import MoreQuestions from '../MoreQuestions';
import MakeChanges from '../MakeChanges';

const Available = ({ downloadUrl }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <ReviewAndDownload downloadUrl={downloadUrl} />
      <MakeChanges />
      <CoeDocumentList />
      <MoreQuestions />
    </div>
  </div>
);

export default Available;
