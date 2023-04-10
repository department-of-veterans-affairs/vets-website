import React from 'react';
import { useSelector } from 'react-redux';

const PrintHeader = () => {
  const user = useSelector(state => state.user.profile);
  const { first, last, middle, suffix } = user.userFullName;
  const name = user.first
    ? `${last}, ${first} ${middle}, ${suffix}`
    : 'Doe, John R., Jr.';
  const dob = user.dob || '12/12/1980';

  return (
    <div className="print-only print-header vads-u-padding-bottom--2">
      <span>
        {name} - DOB {dob}
      </span>
      <h4>CONFIDENTIAL</h4>
    </div>
  );
};

export default PrintHeader;
