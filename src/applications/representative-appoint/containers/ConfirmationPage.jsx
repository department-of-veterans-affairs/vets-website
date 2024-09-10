import React, { useState } from 'react';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
      <va-link
        download
        href=""
        label="Download your form"
        onClick={handlers.onClickDownloadForm}
        text="Download your form"
      />
      <p>Then, you’ll need to print and sign your form.</p>
      <VaCheckbox
        checked={signedForm}
        className="vads-u-margin-bottom--4"
        error={
          signedFormError
            ? "Please confirm that you've downloaded, printed, and signed your form."
            : null
        }
        label="I've downloaded, printed, and signed my form"
        name="signedForm"
        required
        onVaChange={handlers.onChangeSignedFormCheckbox}
      />
      <va-button continue onClick={handlers.onClickContinueButton} />
    </>
  );
}
