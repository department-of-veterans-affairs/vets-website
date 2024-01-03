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
        Uploading a copy can help us process your application faster.
      </p>
      <p className="vads-u-font-size--base vads-u-font-weight--normal vads-u-font-family--sans">
        If you don’t have a copy of the deceased Veteran’s DD214 you can submit
        a records request.
      </p>
    </>
  );
}
