import React from 'react';
import FileUploadDescription from './FileUploadDescription';

const SupportingDocsLink = label => (
  <p>
    <a
      target="_blank"
      rel="noreferrer noopener"
      href="/resources/how-to-file-a-champva-claim/#supporting-documents-to-send-w"
    >
      {label}
    </a>
  </p>
);

const ResubmissionLetterDescription = (
  <>
    <p>
      You’ll need to submit the CHAMPVA letter you received about your claim.
    </p>
    <p>
      This could be a letter on CHAMPVA letterhead requesting missing documents.
      Or, a CHAMPVA explanation of benefits.
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
        An explanation of benefits from your insurance company,{' '}
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
    {SupportingDocsLink(
      'Learn more about supporting medical claim documents (opens in a new tab)',
    )}
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
    <FileUploadDescription />
  </>
);

const ResubmissionAddtlDocsDescription = (
  <>
    <p>
      You can submit any documents that may help us gather information to
      support your claim.
    </p>
    <p>This could include 1 of these documents:</p>
    <ul>
      <li>
        Any billing statement with the provider’s contact information,{' '}
        <strong>or</strong>
      </li>
      <li>
        Any paperwork attached to your prescription, <strong>or</strong>
      </li>
      <li>
        Any receipts or statements from your pharmacy with their contact
        information, <strong>or</strong>
      </li>
      <li>An explanation of benefits from your insurance company</li>
    </ul>
  </>
);

const ResubmissionAddtlDocsUploadDescription = (
  <>
    <p>
      <strong>Note:</strong> Don’t submit any medical records related to your
      claim. And don’t upload previously submitted documents from your existing
      claim.
    </p>
    {SupportingDocsLink(
      'Learn more about supporting medical claim documents (opens in a new tab)',
    )}
    <FileUploadDescription />
  </>
);

export {
  ResubmissionDocsDescription,
  ResubmissionLetterDescription,
  ResubmissionDocsUploadDescription,
  ResubmissionAddtlDocsDescription,
  ResubmissionAddtlDocsUploadDescription,
};
