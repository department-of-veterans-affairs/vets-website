import React from 'react';

export const OptInTitle = (
  <strong>
    I understand that if any issues I’ve selected are from the legacy appeal
    process, I’m opting them into the new decision review process.
  </strong>
);

export const optInDescription = (
  <span className="hide-on-review">
    By checking this box, you’re withdrawing any issue you’ve selected from the
    legacy appeals process (this is the process for decisions received before
    February 19, 2019). Instead, the Board will consider your claim for this
    condition under the new process.
  </span>
);

export const optInErrorMessage =
  'Please opt into the new decision review process to proceed';
