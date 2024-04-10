import React from 'react';

const PrintHeader = () => {
  return (
    <div className="print-only print-header vads-u-margin-bottom--4">
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
