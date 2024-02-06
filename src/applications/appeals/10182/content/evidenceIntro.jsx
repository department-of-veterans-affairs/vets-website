import React from 'react';

export const evidenceUploadIntroTitle = (
  <h3 className="vads-u-margin-y--0">Additional evidence</h3>
);

export const evidenceUploadIntroDescription = (
  <>
    <p id="additional-evidence-description">
      You can choose to submit more evidence now or within 90 days after we
      receive this request.
    </p>
    <div className="vads-u-margin-top--2">
      <va-additional-info trigger="How do I submit evidence later?" uswds>
        You can submit more evidence by mailing it to this address:
        <p className="vads-u-padding-y--2">
          Board of Veterans’ Appeals
          <br role="presentation" />
          PO Box 27063
          <br role="presentation" />
          Washington, D.C. 20038
        </p>
        You can also fax it to{' '}
        <va-telephone not-clickable contact="8446788979" />
      </va-additional-info>
    </div>
  </>
);

export const evidenceUploadIntroLabel =
  'Would you like to submit more evidence right now?';
