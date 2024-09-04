import React, { useState } from 'react';

import {
  VaButton,
  VaCheckbox,
  VaIcon,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function ConfirmationPage() {
  const [signedForm, setSignedForm] = useState(false);
  const [signedFormError, setSignedFormError] = useState(false);

  const handlers = {
    onClickDownloadForm: e => {
      e.preventDefault();
    },
    onChangeSignedFormCheckbox: () => {
      setSignedForm(prevState => !prevState);

      if (signedFormError) setSignedFormError(false);
    },
    onClickContinueButton: () => {
      if (!signedForm) {
        setSignedFormError(true);
      } else {
        // Todo - Direct user to final Appoint a Rep page
        // Update the body of this condition once the final page is complete
      }
    },
  };

  return (
    <>
      <h2 className="vads-u-font-size--h3">
        Download, print, and sign your form
      </h2>
      <p>First, you’ll need to download your form.</p>
      <VaIcon
        size={3}
        icon="file_download"
        className="vads-u-margin-right--1"
      />
      <VaLink
        active
        onClick={handlers.onClickDownloadForm}
        href=""
        text="Download your form"
        aria-label="Download your form"
      />
      <p>Then, you’ll need to print and sign your form.</p>
      <VaCheckbox
        id="signedForm"
        name="signedForm"
        className="vads-u-margin-bottom--4"
        label="I've downloaded, printed, and signed my form"
        onVaChange={handlers.onChangeSignedFormCheckbox}
        checked={signedForm}
        error={
          signedFormError
            ? "Please confirm that you've downloaded, printed, and signed your form."
            : null
        }
        required
      />
      <VaButton onClick={handlers.onClickContinueButton} text="Continue" />
    </>
  );
}
