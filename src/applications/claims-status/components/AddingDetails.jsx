import React from 'react';

function AddingDetails() {
  return (
    <>
      <div className="alert-demo-text">
        Adding Details Alert <br />
        Triggered by: Claim missing required data (type, contentions, or date)
      </div>
      <va-alert
        class="vads-u-margin-bottom--1"
        close-btn-aria-label="Close notification"
        full-width="false"
        slim
        status="info"
        visible="true"
        data-test-id="adding-details"
      >
        <p className="vads-u-margin-y--0">
          We can't show all of the details of your claim. Please check back
          later.
        </p>
      </va-alert>
    </>
  );
}

export default AddingDetails;
