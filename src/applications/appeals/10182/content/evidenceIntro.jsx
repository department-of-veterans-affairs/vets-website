import React from 'react';

export const evidenceUploadIntroTitle = (
  <h3 className="vads-u-margin-y--0">Additional evidence</h3>
);

export const bvaAddressAndFax = (
  <>
    <div className="vads-u-padding-y--2">
      <div>Board of Veterans’ Appeals</div>
      <div>PO Box 27063</div>
      <div>Washington, DC 20038</div>
    </div>
    You can also fax it to <va-telephone not-clickable contact="8446788979" />
  </>
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
        {bvaAddressAndFax}
      </va-additional-info>
    </div>
  </>
);

export const evidenceUploadIntroLabel =
  'Would you like to submit more evidence right now?';
