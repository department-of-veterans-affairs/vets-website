import React from 'react';

const COEAvailable = ({ downloadURL }) => (
  <>
    <va-alert status="info">
      <h2 slot="headline">You already have a COE</h2>
      <div>
        <p>You requested a COE on: June 30, 2020</p>
        <p>
          You have a COE available so you don’t need to fill out a request. You
          can review the details about your COE status or download your COE now.
        </p>
        <a href="/housing-assistance/home-loans/request-coe-form-26-1880/eligibility">
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
      <a href={downloadURL}>
        <i
          className="fas fa-download vads-u-padding-right--1"
          aria-hidden="true"
        />
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
        <li>Request a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

export default COEAvailable;
