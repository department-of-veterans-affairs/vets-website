import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const FDCDescription = (
  <div>
    <h3 className="vads-u-font-size--h5">Fully developed claim program</h3>
    <p>
      You can apply using the Fully Developed Claim (FDC) program if you’ve
      uploaded all the supporting documents or additional forms needed to
      support your claim.
    </p>
    <ul>
      <li>
        <va-link
          href="/disability/how-to-file-claim/evidence-needed/fully-developed-claims/"
          text="Learn more about the FDC program"
          external
        />
        .
      </li>
      <li>
        <va-link
          href="/disability/how-to-file-claim/evidence-needed/"
          text="View the evidence requirements for disability claims"
          external
        />
        .
      </li>
    </ul>
  </div>
);

export const FDCWarning = (
  <div className="usa-alert usa-alert-info background-color-only">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since you’ve uploaded all your supporting documents, your claim will be
        submitted as a fully developed claim.
      </div>
    </div>
  </div>
);

export const noFDCWarning = (
  <div className="usa-alert usa-alert-info background-color-only">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        <p>
          Since you’ll be sending in additional documents later, your
          application doesn’t qualify for the Fully Developed Claim program.
          We’ll review your claim through the standard claim process. With the
          standard claim process, you have up to 1 year from the date we receive
          your claim to turn in any information and evidence.
        </p>
        <p>You can turn in your evidence in 1 of 3 ways:</p>
        <ul>
          <li>
            Visit the Claim Status tool and upload your documents under the File
            tab.{' '}
            <va-link
              href="/track-claims"
              text="Track the status of your claims"
              external
            />
          </li>
          <li>
            Call Veterans Benefits Assistance at{' '}
            <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through
            Friday, 8:00 a.m. to 9:00 p.m. ET.
          </li>
          <li>
            Save your application and return to it later when you have your
            evidence ready to upload.
          </li>
        </ul>
      </div>
    </div>
  </div>
);
