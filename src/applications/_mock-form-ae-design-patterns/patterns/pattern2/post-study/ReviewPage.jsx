import React from 'react';
import PrefillAlerts from './PrefillAlerts';
import UneditableData from './UneditableData';

const ReviewPage = () => {
  return (
    <div id="post-study" className="vads-u-padding-y--5">
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns print-full-width">
          <PrefillAlerts />
          <UneditableData />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
