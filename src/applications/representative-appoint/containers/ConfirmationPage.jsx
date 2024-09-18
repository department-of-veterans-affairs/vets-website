import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NeedHelp from '../components/NeedHelp';

export default function ConfirmationPage({ router }) {
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
      if (signedForm) {
        router.push('/next-steps');
      } else {
        setSignedFormError(true);
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
      <p className="vads-u-margin-top--4">
        Then, you’ll need to print and sign your form.
      </p>
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
      <NeedHelp />
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
