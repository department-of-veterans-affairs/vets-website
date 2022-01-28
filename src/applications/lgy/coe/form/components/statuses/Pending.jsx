import React, { useState } from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import StatusBox from '../../../shared/components/StatusBox';
import SubwayMap from '../introduction/SubwayMap';

const Pending = ({ applicationCreateDate, status }) => {
  const [showSubwayMap, setShowSubwayMap] = useState(false);

  const clickHandler = () => {
    setShowSubwayMap(true);
  };

  return (
    <>
      <StatusBox.Pending
        applicationCreateDate={applicationCreateDate}
        origin={'form'}
        status={status}
      />
      <div>
        <h2>Should I make a new request?</h2>
        <p>
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, please don’t apply again. Call our
          toll-free number at <Telephone contact="8778273702" />.
        </p>
        <p>
          The only time you’d need to apply again is if our VA home loan case
          management team recommends that you do this.
          <br />
          <button className="va-button-link" onClick={clickHandler}>
            Request a VA home loan COE again
          </button>
        </p>
      </div>
      {showSubwayMap && (
        <div>
          <h2>Follow these steps to reapply for a VA home loan COE</h2>
          <SubwayMap />
        </div>
      )}
    </>
  );
};

export default Pending;
