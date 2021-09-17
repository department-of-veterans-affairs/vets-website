import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const COEPending = props => {
  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">
          {props.status === 'pending-upload'
            ? 'We need more information from you'
            : 'We’re reviewing your application'}
        </h2>
        <p>You applied on:  June 30, 2020</p>
        <div>
          <p>
            {props.status === 'pending-upload'
              ? "You'll need to upload documents before we can make a decision on your COE application."
              : "If you qualify for a Certificate of Eligibility, we'll notify you by email or mail to let you know how to get your COE."}
          </p>
          <a href="/housing-assistance/home-loans/apply-for-coe-form-26-1880/eligibility">
            Go to your VA home loan COE page to see status details
          </a>
        </div>
      </va-alert>
      <div>
        <h2>Should I apply again?</h2>
        <p>
          No. We’re reviewing your current application, and submitting a new
          application won’t affect our decision or speed-up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          application and you haven’t heard back, please don’t apply again. Call
          our toll-free number at <Telephone contact="8778273702" />.
        </p>
        <p>
          We only recommend applying again if you’ve already worked with our VA
          home loans case management team, and they’ve advised you to reapply.
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
      <h2>Follow these steps to reapply for a VA home loan COE</h2>
    </>
  );
};

export default COEPending;
