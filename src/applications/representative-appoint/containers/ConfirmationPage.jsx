import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
  VaAlert,
  VaButton,
  VaCheckbox,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ConfirmationPage = () => {
  const [downloadedForm, setDownloadedForm] = useState(false);
  const [downloadedFormError, setDownloadedFormError] = useState(false);
  const [signedForm, setSignedForm] = useState(false);
  const [signedFormError, setSignedFormError] = useState(false);

  useEffect(() => {
    const downloaded = localStorage.getItem('downloadedForm');

    if (downloaded !== null) {
      setDownloadedForm(JSON.parse(downloaded));
    }
  }, []);

  const handlers = {
    onClickDownloadForm: () => {
      setDownloadedForm(true);
      localStorage.setItem('downloadedForm', true);
    },
    onChangeSignedFormCheckbox: () => {
      setSignedForm(prevState => !prevState);

      if (signedFormError) setSignedFormError(false);
    },
    onClickContinueButton: () => {
      if (!downloadedForm && !signedForm) {
        setDownloadedFormError(true);
        setSignedFormError(true);
      } else if (!downloadedForm) {
        setDownloadedFormError(true);
      } else if (!signedForm) {
        setSignedFormError(true);
      } else {
        // Go to instructions page
      }
    },
  };

  return (
    <>
      <h3>Download, print, and sign your form</h3>
      <p>First, you’ll need to download your form.</p>
      {downloadedFormError ? (
        <VaAlert status="error">
          <h3 slot="headline">You must download your form</h3>
          <VaLink
            active
            data-testid=""
            onClick={handlers.onClickDownloadForm}
            href=""
            text="Download your form"
            aria-label="Download your form"
          />
        </VaAlert>
      ) : (
        <VaLink
          active
          data-testid=""
          onClick={handlers.onClickDownloadForm}
          href=""
          text="Download your form"
          aria-label="Download your form"
        />
      )}
      <p>Then, you’ll need to print and sign your form.</p>
      <VaCheckbox
        id="signedForm"
        name="signedForm"
        class="vads-u-margin-bottom--4"
        label="I've downloaded, printed, and signed my form"
        onVaChange={handlers.onChangeSignedFormCheckbox}
        checked={signedForm}
        error={
          signedFormError
            ? "You must confirm that you've downloaded, printed, and signed your form."
            : null
        }
        required
      />
      <VaButton onClick={handlers.onClickContinueButton} text="Continue" />
    </>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
