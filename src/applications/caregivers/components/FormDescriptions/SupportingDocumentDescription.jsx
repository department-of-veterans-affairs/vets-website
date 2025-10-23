import React from 'react';
import DocumentTypeDescription from './DocumentTypeDescription';

const SupportingDocumentDescription = (
  <>
    <p>
      If you don’t have one of the documents listed here, the Veteran will need
      to sign the application for themselves.
    </p>
    {DocumentTypeDescription}

    <h4>How to upload files:</h4>

    <ul className="vads-u-margin-bottom--3">
      <li>Use a .pdf, .jpg, .jpeg, or .png file format.</li>
      <li>
        Make sure the file is 10{' '}
        <dfn>
          <abbr title="Megabytes">MB</abbr>
        </dfn>{' '}
        or less.
      </li>
      <li>
        If you only have a paper copy, scan or take a photo and upload the
        image.
      </li>
      <li>
        Be sure to upload the entire document. We can’t accept a cover or
        signature page without the rest of the document.
      </li>
    </ul>
  </>
);

export default SupportingDocumentDescription;
