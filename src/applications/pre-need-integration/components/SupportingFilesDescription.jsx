import React from 'react';
import CollapsibleList from './SupportingFilesCollapsibleList';

export default function SupportingFilesDescription() {
  return (
    <div>
      <div>
        <h3 className="vads-u-font-size--h5">Upload supporting files </h3>

        <p>
          If you have supporting files readily available, you can upload them to
          help us make a determination. If you don't have service history files,
          you can still apply and we'll request them for you.{' '}
        </p>

        <p>
          You can upload your files from the device you're using to submit this
          application, such as your computer, tablet, or mobile phone.{' '}
        </p>
        <CollapsibleList />
      </div>
      Guidelines for uploading a file:
      <ul>
        <li>File types you can upload: .pdf, .jpg, .jpeg, .png</li>
        <li>Maximum non-PDF file size: 50MB</li>
        <li> Maximum PDF file size: 100MB </li>
      </ul>
    </div>
  );
}
