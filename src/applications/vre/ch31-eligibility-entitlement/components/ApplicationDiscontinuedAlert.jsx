import React from 'react';

const ApplicationDiscontinuedAlert = () => {
  return (
    <div className="usa-width-two-thirds vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">Sorry, your application has been discontinued</h3>
        <p className="vads-u-margin-y--0">
          Please contact the Central Office at{' '}
          <va-telephone contact="8773459876" /> between the hours 8:00am ET and
          5:00pm ET. You can find a copy of the letter down below.
        </p>
        <p>
          Your application has been discontinued and it’s ineligible for Chapter
          31 benefits for the following reason:
        </p>
        <p>
          More information can be found in your letter and you can download a
          copy of your letter by clicking on “Download Letter”:
        </p>
        <p className="usa-width-one-whole">
          <va-link
            download
            filetype="PDF"
            href="https://www.va.gov"
            text="Download Letter"
          />
        </p>
      </va-alert>
    </div>
  );
};

export default ApplicationDiscontinuedAlert;
