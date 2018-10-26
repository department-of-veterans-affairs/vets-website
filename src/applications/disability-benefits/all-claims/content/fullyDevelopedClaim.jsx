import React from 'react';

export const FDCDescription = (
  <div>
    <h5>Fully developed claim program</h5>
    <p>
      You can apply using the Fully Developed Claim (FDC) program if you’ve
      uploaded all the supporting documents or supplemental forms needed to
      support your claim.
    </p>
    <a href="/pension/apply/fully-developed-claim/" target="_blank">
      Learn more about the FDC program
    </a>
    .
  </div>
);

export const FDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Since you’ve uploaded all your supporting documents, your claim will be
        submitted as a fully developed claim.
      </div>
    </div>
  </div>
);

export const noFDCWarning = (
  <div className="usa-alert usa-alert-info no-background-image">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        <p>
          Since you’ll be sending in additional documents later, your
          application doesn’t qualify for the Fully Developed Claim program.
          We’ll review your claim through the standard claim process. With the
          standard claim process, you have up to 1 year from the date we receive
          your claim to turn in any information and evidence.
        </p>
        <p>You can turn in your evidence 1 of 3 ways:</p>
        <ul>
          <li>
            Visit the Claim Status tool and upload your documents under the File
            tab. <a href="/track-claims">Track the status of your claims.</a>
          </li>
          <li>
            Call Veterans Benefits Assistance at{' '}
            <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday – Friday,
            8:30 a.m. – 4:30 p.m. (ET).
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
