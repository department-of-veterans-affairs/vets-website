import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export const evidenceUploadIntroTitle = 'Additional evidence';

export const evidenceUploadIntroDescription = (
  <>
    <p>
      You can choose to submit more evidence now or within 90 days after we
      receive this request.
    </p>
    <div className="vads-u-margin-y--2">
      <va-additional-info trigger="How do I submit evidence later?">
        You can submit more evidence by mailing it to this address:
        <p>
          Board of Veterans’ Appeals
          <br />
          PO Box 27063
          <br />
          Washington, D.C. 20038
        </p>
        You can also fax it to <Telephone notClickable contact="844-678-8979" />
      </va-additional-info>
    </div>
  </>
);

export const evidenceUploadIntroLabel =
  'Would you like to submit more evidence right now?';
