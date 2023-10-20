import React from 'react';
import { useSelector } from 'react-redux';

import { REDIRECTED_PART3 } from '../constants';

const title = 'Request an extension';

const ShowAlert = () => {
  // get from loadedData since it's temporary
  const part3 = useSelector(
    state => state.form.loadedData.metadata[REDIRECTED_PART3],
  );
  if (part3) {
    return (
      <va-alert
        background-only
        status="info"
        class="vads-u-margin-y--1"
        role="alert"
      >
        <p>
          We updated the Board Appeal with new questions. Your previous
          responses have been saved. You’ll need to review your application in
          order to submit.
        </p>
      </va-alert>
    );
  }
  return null;
};

export const content = {
  title: <ShowAlert />,
  description: (
    <>
      <h3 className="vads-u-margin-top--0">{title}</h3>
      <p className="vads-u-margin-top--0">
        If you request an extension (extra time) to file VA Form 10182 for good
        cause, you’ll need to tell us why you have good cause.
      </p>
    </>
  ),
  label: 'Are you requesting an extension?',
};
