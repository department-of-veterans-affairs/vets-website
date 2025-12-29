import React from 'react';

export default () => {
  return (
    <div>
      <va-card>
        <h2 id="track-your-status-on-mobile" slot="headline">
          This claimant has an ITF on file
        </h2>
        <h3>Snow, John</h3>
        Gainesville, WI 55412
        <p className="vads-u-margin-y--0">
          <strong>Benefit:</strong> Disability Compensation (VA Form 21-526EZ)
          <strong>ITF Date:</strong> December 12, 2025 (Expires after 1 year)
        </p>
      </va-card>
      <strong>Note:</strong> You can’t submit a new intent to file for [ITF
      type] until the current one expires.
    </div>
  );
};
