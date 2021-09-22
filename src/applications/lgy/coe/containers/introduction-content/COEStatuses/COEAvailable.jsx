import React from 'react';

const COEAvailable = () => (
  <>
    <va-alert status="info">
      <h2 slot="headline">You already have a COE</h2>
      <div>
        <p>You applied on:  June 30, 2020</p>
        <p>
          If you qualify for a Certificate of Eligibility, we’ll notify you by
          email or mail to let you know how to get your COE.
        </p>
        <a href="/housing-assistance/home-loans/apply-for-coe-form-26-1880/eligibility">
          Go to your VA home loan COE page to review the details of your COE
          status
        </a>
      </div>
    </va-alert>
    <div>
      <h2>Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
      </p>
      <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
        Get instructions for downloading a VA.gov PDF
      </a>
    </div>
    <div className="vads-u-padding-top--4">
      <a href="#">
        <i
          className="fas fa-download vads-u-padding-right--1"
          aria-hidden="true"
        />{' '}
        Download your COE (PDF) 0.20MB
      </a>
    </div>
    <div>
      <h2>What if I need to make changes to my COE?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Apply for a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

export default COEAvailable;
