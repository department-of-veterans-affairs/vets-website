import React from 'react';
import DocumentTypeDescription from './DocumentTypeDescription';
import content from '../../locales/en/content.json';

const ApplicationSignatureDescription = (
  <>
    <p>
      Now we’ll guide you through the steps to review and sign this application.
    </p>
    <p>
      First, we need to know if the Veteran will sign this application or if a
      representative will sign for them.
    </p>
    <p>
      A representative must have legal authority to make decisions on behalf of
      the Veteran. Or they must have authority to fill out or sign applications
      on behalf of the Veteran.
    </p>
    <p>
      If you select that you’re the Veteran’s representative, we’ll ask you to
      upload a document that proves you have this authority.
    </p>

    <va-additional-info trigger="Learn more about the types of documents we can and can’t accept">
      <div>
        <p className="vads-u-margin-top--0">
          {content['sign-as-rep-document-description']}
        </p>
        {DocumentTypeDescription}
      </div>
    </va-additional-info>

    <p className="vads-u-margin-y--4">
      <strong>Note:</strong> We use this signature only to process your
      application. Signing for the Veteran today doesn’t take away their right
      to make decisions for their care.
    </p>
  </>
);

export default ApplicationSignatureDescription;
