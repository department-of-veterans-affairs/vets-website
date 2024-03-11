import React from 'react';
import { useSelector } from 'react-redux';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { formatName } from '../../../shared/util/helpers';

const PrintHeader = () => {
  const user = useSelector(state => state.user);
  const name = user?.profile?.userFullName
    ? formatName(user.profile.userFullName)
    : '';

  return (
    <div className="print-only print-header vads-u-margin-bottom--4">
      <div className="name-dob vads-u-margin-bottom--3">
        {name && <span data-testid="print-header-name">{name}</span>}
        {user?.profile?.dob && (
          <span>Date of birth: {formatDateLong(user.profile.dob)}</span>
        )}
      </div>

      <div
        id="crisis-line-print"
        className="vads-u-border--2px vads-u-padding--0p5 vads-u-text-align--center print-only"
      >
        If you’re ever in crisis and need to talk to someone right away, call
        the Veterans Crisis Line at{' '}
        <span className="vads-u-font-weight--bold">988</span>. Then select 1.
      </div>
    </div>
  );
};

export default PrintHeader;
