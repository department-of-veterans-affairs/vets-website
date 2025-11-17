import React from 'react';

export const evidenceWillUploadTitle =
  'Do you want to upload your records or other documents to support your claim?';

export const evidenceWillUploadInfo = (
  <va-additional-info
    trigger="Types of supporting evidence"
    class="vads-u-margin-top--2 vads-u-margin-bottom--4"
  >
    <div>
      Supporting evidence can include private medical records or a buddy/lay
      statement. A buddy/lay statement is a written statement from family,
      friends, or coworkers to help support your claim.
    </div>
  </va-additional-info>
);

export const reviewField = ({ children }) =>
  children?.props.formData ? (
    <div className="review-row">
      <dt>{evidenceWillUploadTitle}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;
