import React from 'react';
import FileUploadDescription from './FileUploadDescription';

const ResubmissionUploadDescription = (
  <>
    <FileUploadDescription />
    <p className="vads-u-margin-bottom--4">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="/resources/how-to-file-a-champva-claim/"
      >
        Learn how to file a CHAMPVA claim (opens in a new tab)
      </a>
    </p>
  </>
);

const ResubmissionLetterDescription = (
  <>
    <p>
      You’ll need to submit the letter you received from CHAMPVA requesting
      further action on your claim.
    </p>
    <p>
      This could be a letter on CHAMPVA letterhead requesting information or an
      Explanation of Benefits from CHAMPVA.
    </p>
  </>
);

const ResubmissionDocsDescription = (
  <>
    <p>
      You’ll need to submit copies of documents with any missing information we
      requested.
    </p>
    <p>These documents could include 1 of these:</p>
    <ul>
      <li>
        An itemized billing statement (often called a superbill) from your
        provider, <strong>or</strong>
      </li>
      <li>
        An Explanation of Benefits from your insurance company,{' '}
        <strong>or</strong>
      </li>
      <li>
        Paperwork attached to your prescription, <strong>or</strong>
      </li>
      <li>A pharmacy statement</li>
    </ul>
  </>
);

const ResubmissionDocsUploadDescription = (
  <>
    <p>
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="/resources/how-to-file-a-champva-claim/#supporting-documents-to-send-w"
      >
        Learn more about supporting medical claim documents (opens in a new tab)
      </a>
    </p>
    <p className="vads-u-margin-bottom--4">
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="/resources/how-to-file-a-champva-claim/#if-youre-filing-a-claim-for-pr"
      >
        Learn more about supporting pharmacy claim documents (opens in a new
        tab)
      </a>
    </p>
    {ResubmissionUploadDescription}
  </>
);

export {
  ResubmissionDocsDescription,
  ResubmissionLetterDescription,
  ResubmissionUploadDescription,
  ResubmissionDocsUploadDescription,
};
