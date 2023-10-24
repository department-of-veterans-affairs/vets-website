import React from 'react';

export const SpouseInfoDescription = () => {
  const date = new Date();
  const lastYear = date.getFullYear() - 1;
  return (
    <va-additional-info
      trigger="Why we ask for this information"
      class="vads-u-margin-top--1 vads-u-margin-bottom--4"
    >
      <div>
        <p className="vads-u-margin-top--0">
          This information helps us determine if your spouse was your dependent
          in {lastYear}.
        </p>
      </div>
    </va-additional-info>
  );
};

export default SpouseInfoDescription;
