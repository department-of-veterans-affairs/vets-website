import React from 'react';

const Failed = () => {
  return (
    <div className="vads-u-padding--3 vads-u-padding-y--7">
      <va-alert status="error">
        <h3 slot="headline">Please see a staff member to complete check-in.</h3>
      </va-alert>
    </div>
  );
};

export default Failed;
