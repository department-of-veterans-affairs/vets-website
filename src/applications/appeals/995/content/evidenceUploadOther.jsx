import React from 'react';

const evidenceUploadOtherTitle =
  'Do you want to upload your records or other documents to support your claim?';

export const evidenceUploadOtherHeader = (
  <h3 className="vads-u-margin-top--0">{evidenceUploadOtherTitle}</h3>
);

export const evidenceUploadOtherInfo = (
  <va-additional-info
    trigger="Types of supporting evidence"
    class="vads-u-margin-top--2"
  >
    <div>
      <p className="vads-u-margin-top--0">Lay statements or other evidence.</p>
      <p className="vads-u-margin-bottom--0">
        A lay statement is a written statement from family, friends, or
        coworkers to help support your claim. Lay statements are also called
        “buddy statements.” In most cases, you’ll only need your medical records
        to support your disability claim. But some claims—such as those for
        Posttraumatic Stress Disorder or military sexual trauma—could benefit
        from a lay or buddy statement.
      </p>
    </div>
  </va-additional-info>
);

export const reviewField = ({ children }) =>
  children?.props.formData ? (
    <div className="review-row">
      <dt>{evidenceUploadOtherTitle}</dt>
      <dd>{children}</dd>
    </div>
  ) : null;
