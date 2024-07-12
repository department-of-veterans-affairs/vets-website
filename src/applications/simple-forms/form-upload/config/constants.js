import React from 'react';

export const PrimaryActionLink = ({ href = '/', children, onClick = null }) => (
  <div className="action-bar-arrow">
    <div className="vads-u-background-color--primary vads-u-padding--1">
      <a className="vads-c-action-link--white" href={href} onClick={onClick}>
        {children}
      </a>
    </div>
  </div>
);

export const TITLE = 'Upload VA Form 21-0779';
export const SUBTITLE =
  'Request for Nursing Home Information in Connection with Claim for Aid and Attendance';

export const workInProgressContent = {
  description:
    'We’re rolling out Submit a Statement to Support a Claim (VA Form 21-4138) in stages. It’s not quite ready yet. Please check back again soon.',
  redirectLink: '/',
  redirectText: 'Return to VA home page',
};

export const UPLOAD_GUIDELINES = Object.freeze(
  <>
    <h3 className="vads-u-margin-bottom--3">Upload your file</h3>
    <p className="vads-u-margin-top--0">
      You’ll need to scan your document onto the device you’re using to submit
      this application, such as your computer, tablet, or mobile phone. You can
      upload your document from there.
    </p>
    <div>
      <p>Guidelines for uploading a file:</p>
      <ul>
        <li>You can upload a .pdf, .jpeg, or .png file</li>
        <li>Your file should be no larger than 25MB</li>
      </ul>
    </div>
  </>,
);

export const SAVE_IN_PROGRESS_CONFIG = {
  messages: {
    inProgress: 'Your form upload is in progress.',
    expired:
      'Your form upload has expired. If you want to upload a form, please start a new request.',
    saved: 'Your form upload has been saved.',
  },
};

export const PROGRESS_BAR_LABELS =
  'Upload your file;Review your information;Submit your form';
