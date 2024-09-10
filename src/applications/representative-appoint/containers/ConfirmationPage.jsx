import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
      <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary">
        Need help?
      </h2>
      <p>
        You can call us at <va-telephone contact="8006982411" extension="0" />{' '}
        <va-telephone contact="711" tty />. We're here 24/7.
      </p>
    </>
  );
}

ConfirmationPage.propTypes = {
  router: PropTypes.object,
};
