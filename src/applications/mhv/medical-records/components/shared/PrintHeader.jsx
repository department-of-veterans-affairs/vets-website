import React from 'react';
import { useSelector } from 'react-redux';

const PrintHeader = () => {
  const user = useSelector(state => state.user.profile);
  const { first, last, middle, suffix } = user.userFullName;
  const name = user.first
    ? `${last}, ${first} ${middle}, ${suffix}`
    : 'Doe, John R., Jr.';
  const dob = user.dob || 'March 15, 1982';

  return (
    <div className="print-only print-header vads-u-margin-bottom--4">
      <div className="name-dob vads-u-margin-bottom--3">
        <span>{name}</span>
        <span>Date of birth: {dob}</span>
      </div>

      <div
        id="crisis-line-print"
        className="vads-u-border--2px vads-u-padding--0p5 vads-u-text-align--center print-only"
      >
        If you’re ever in crisis and need to talk to someone right away, call
        the Veterans Crisis line at <strong>988</strong>. Then select 1.
      </div>
    </div>
  );
};

export default PrintHeader;
