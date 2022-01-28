import React from 'react';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import MakeChanges from '../MakeChanges';
import MoreQuestions from '../MoreQuestions';

const Eligible = ({ clickHandler, downloadUrl }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <va-alert status="success">
        <h2 slot="headline" className="vads-u-font-size--h3">
          Congratulations on your automatic COE
        </h2>
        <p>
          We have all the information we need, so you don’t need to fill out an
          application. You can download your COE now.
        </p>
      </va-alert>
      <ReviewAndDownload downloadUrl={downloadUrl} />
      <MakeChanges clickHandler={clickHandler} />
      <MoreQuestions />
    </div>
  </div>
);

export default Eligible;
