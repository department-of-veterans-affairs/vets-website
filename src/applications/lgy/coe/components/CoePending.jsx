import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { CoeDocumentUpload } from './CoeDocumentUpload';

export const CoePending = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="medium-8 columns">
      <va-alert status="warning">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We’re reviewing your application
        </h2>
        <p className="vads-u-font-size--base">You applied on June 1, 2019</p>
        <p>
          If you qualify for a Certificate of Eligibility, we’ll notify you by
          email or mail to let you know how to get your COE.
        </p>
      </va-alert>
      <CoeDocumentUpload />
      <h2>How will I know if VA needs more information from me?</h2>
      <p className="vads-u-margin-bottom--0">
        If we need more information, we’ll notify you by email or mail. You can
        also check the status of your application by returning to this page.
      </p>
      <a>Learn more about VA decision reviews and appeals</a>
      <h2>Should I apply again?</h2>
      <p className="vads-u-margin-bottom--0">
        No. We’re reviewing your current application, and submitting a new
        application won’t affect our decision or speed-up the process.
      </p>
      <p>
        If more than 5 business days have passed since you submitted your
        application and you haven’t heard back, please don’t apply again. Call
        our toll-free number at <Telephone contact={'877-827-3702'} />.
      </p>
      <h2>What if I have more questions?</h2>
      <p className="vads-u-margin-bottom--0">
        If you have any questions that your lender can’t answer, please call
        your VA regional loan center at
        <Telephone contact={877 - 827 - 3702} />. We’re here Monday through
        Friday, 8:00 a.m. to 6:00 p.m. ET.
      </p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.benefits.va.gov/HOMELOANS/contact_rlc_info.asp"
      >
        Find your regional loan center.
      </a>
    </div>
  </div>
);
