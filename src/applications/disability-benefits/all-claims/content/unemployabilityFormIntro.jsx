import React from 'react';

export const unemployabilityTitle = (
  <legend className="schemaform-block-title schemaform-title-underline">
    Individual Unemployability
  </legend>
);

export const unemployabilityPageTitle = title => (
  <h3 className="vads-u-font-size--h4">{title}</h3>
);

export const introDescription = (
  <div>
    <p>
      VA Form 21-8940 (Veteran’s Application for Increased Compensation Based on
      Unemployability).
      <br />
    </p>
    <p>Filing a claim for Individual Unemployability is a two-part process:</p>
    <div className="process schemaform-process">
      <ol>
        <li className="process-step list-one">
          <div>
            <h3>Answer questions</h3>
            <p>
              First, we’ll ask you questions about your situation and how your
              service-connected disability prevents you from holding down a
              steady job. You can choose to answer the questions in this online
              application or you can download and fill out a Veteran’s
              Application for Increased Compensation Based on Unemployability
              (VA Form 21-8940). If you choose to answer the questions, you
              don’t need to fill out the form.
            </p>
          </div>
        </li>
        <li className="process-step list-two">
          <div>
            <h3>Send former employers a request for information form</h3>
            <p>
              Then, we’ll ask you to send each of your former employers a form
              to fill out verifying your past work. You’ll be able to download
              this form called a Request for Employment Information (VA Form
              21-4192) later in the application. If you don’t want to do this
              step yourself, we can request this information from your employer
              for you, but that may delay the processing of your claim.
            </p>
          </div>
        </li>
      </ol>
    </div>
  </div>
);
