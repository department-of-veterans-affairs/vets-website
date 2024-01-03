import React from 'react';

export default function SeparationDocumentsPage() {
  return (
    <>
      <h3 className="vads-u-margin-top--0">
        DD214 or other separation documents
      </h3>
      <p className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans">
        You can choose one of these options:
      </p>
      <ul className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans">
        <li>
          Upload a copy of the Veteran’s DD214 or other separation documents,{' '}
          <strong>or</strong>
        </li>
        <li>Answer questions about the Veteran’s military history</li>
      </ul>
      <p className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans">
        Uploading a copy can help us process your application faster. We’ll ask
        you to upload a copy later in this form.
      </p>
      <p className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans">
        If you don’t have a copy and need these documents to answer questions
        about military service history, you can request them and finish this
        form later.{' '}
        <va-link
          href="https://archives.gov/veterans/military-service-records"
          text="Request military service records on the National Archives website."
        />
      </p>
    </>
  );
}
