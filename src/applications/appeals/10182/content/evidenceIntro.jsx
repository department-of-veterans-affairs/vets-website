import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const evidenceUploadIntroTitle = 'Additional evidence';

export const evidenceUploadIntroDescription = (
  <>
    <p>
      You can choose to submit more evidence with this request, or within 90
      days after we receive this request.
    </p>
    <div className="vads-u-margin-y--2">
      <AdditionalInfo triggerText="How do I submit evidence later?">
        You can submit more evidence by mailing it to this address:
        <p className="va-address-block vads-u-margin-left--0p5">
          Board of Veterans’ Appeals
          <br />
          PO Box 27063
          <br />
          Washington, D.C. 20038
        </p>
        You can also send it by fax to{' '}
        <Telephone notClickable contact="844-678-8979" />
      </AdditionalInfo>
    </div>
  </>
);

export const evidenceUploadIntroLabel =
  'Would you like to submit more evidence right now?';
