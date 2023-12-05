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
    <div className="print-only print-header vads-u-padding-bottom--2">
      <span>Medications | Veterans Affairs</span>
      <span data-testid="name-date-of-birth">
        {name} Date of birth: {dob}
      </span>
    </div>
  );
};

export default PrintHeader;
