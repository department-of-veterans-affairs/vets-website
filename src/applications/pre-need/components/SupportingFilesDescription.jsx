import React from 'react';
import CollapsibleList from './SupportingFilesCollapsibleList';

export default function SupportingFilesDescription() {
  return (
    <div>
      <div>
        <h4 className="vads-u-font-size--h5">Upload supporting files </h4>

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
        <li>You can only upload .pdf files.</li>
        <li>Your file should be no larger than 15MB.</li>
      </ul>
    </div>
  );
}
