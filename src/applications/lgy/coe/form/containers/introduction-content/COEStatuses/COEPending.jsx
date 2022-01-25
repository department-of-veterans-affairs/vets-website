import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import moment from 'moment';

const COEPending = props => {
  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">
          {props.status === 'pending-upload'
            ? 'We need more information from you'
            : 'We’re reviewing your request'}
        </h2>
        <p>
          You requested a COE on:{' '}
          {moment(props.applicationCreateDate).format('MMMM DD, YYYY')}
        </p>
        <div>
          <p>
            {props.status === 'pending-upload'
              ? "You'll need to upload documents before we can make a decision on your COE application."
              : "If you qualify for a Certificate of Eligibility, we'll notify you by email to let you know how to get your COE."}
          </p>
          <a href="/housing-assistance/home-loans/request-coe-form-26-1880/eligibility">
            Go to your VA home loan COE page to review the details of your COE
          </a>
        </div>
      </va-alert>
      <div>
        <h2>Should I apply again?</h2>
        <p>
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, please don’t apply again. Call our
          toll-free number at <Telephone contact="8778273702" />.
        </p>
        <p>
          The only time you’d need to apply again is if our VA home loan case
          management team recommends that you do this.
        </p>
      </div>
      <h2 className="vads-u-margin-top--6">
        Follow these steps to reapply for a VA home loan COE
      </h2>
    </>
  );
};

export default COEPending;
